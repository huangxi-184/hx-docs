#!/usr/bin/env node
/**
 * 安徽 95# 汽油历史价格同步脚本
 * ---------------------------------------------------------------
 * 数据源：团友网 https://www.tuanyou.net/js/shuju/lishi/<regionId>.json
 *         （页面 lishi-2026.html 的表格由前端 JS 渲染，HTML 源码内没有价格，
 *           因此直接请求其数据接口，比解析 DOM 更稳定）
 *
 * 目标：src/.vuepress/components/lishiyoujia.json
 *       结构：[{ "日期": "YYYY-MM-DD", "价格": "8.89 元/升", "涨跌": "-0.54" }, ...]
 *       按日期倒序排列，无结尾换行。
 *
 * 合并策略：
 *   1. 以「日期」为主键合并；
 *   2. 同日期冲突时以接口数据为准（接口为唯一数据源），并打印差异；
 *   3. 本地独有的日期（接口已下架）予以保留，不删除历史数据。
 *
 * 用法：
 *   node scripts/sync-gas-price.mjs                # 同步并写盘
 *   node scripts/sync-gas-price.mjs --dry-run      # 只比对，不写盘
 *   node scripts/sync-gas-price.mjs --since=2019-01-01   # 只保留该日期之后的数据
 *   node scripts/sync-gas-price.mjs --strict       # 拉取失败时以非 0 退出（默认静默降级）
 *
 * 环境变量：
 *   SKIP_GAS_SYNC=1   跳过同步（构建时用于离线/CI 断网场景）
 */

import { readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const API_BASE = 'https://www.tuanyou.net/js/shuju/lishi'
const DEFAULT_REGION = 13 // 13 = 安徽省
const DEFAULT_OUT = path.join(ROOT, 'src/.vuepress/components/lishiyoujia.json')
const PRICE_SUFFIX = ' 元/升'
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

/* ------------------------------- 参数解析 ------------------------------- */

function parseArgs(argv) {
  const opts = {
    region: DEFAULT_REGION,
    out: DEFAULT_OUT,
    dryRun: false,
    strict: false,
    since: null,
    timeout: 20000,
    help: false,
  }
  for (const arg of argv) {
    if (arg === '--dry-run' || arg === '-n') opts.dryRun = true
    else if (arg === '--strict') opts.strict = true
    else if (arg === '--help' || arg === '-h') opts.help = true
    else if (arg.startsWith('--region=')) opts.region = arg.split('=')[1].trim()
    else if (arg.startsWith('--out=')) opts.out = path.resolve(ROOT, arg.split('=')[1].trim())
    else if (arg.startsWith('--since=')) opts.since = arg.split('=')[1].trim()
    else if (arg.startsWith('--timeout=')) opts.timeout = Number(arg.split('=')[1]) || opts.timeout
    else log(`忽略未知参数：${arg}`)
  }
  return opts
}

const log = (...a) => console.log('[gas-price]', ...a)
const warn = (...a) => console.warn('[gas-price]', ...a)

/* ------------------------------- 数据拉取 ------------------------------- */

async function fetchRemote(regionId, timeoutMs, retries = 2) {
  const url = `${API_BASE}/${regionId}.json`
  let lastErr
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
          Referer: 'https://www.tuanyou.net/',
          Accept: 'application/json,text/plain,*/*',
        },
        signal: AbortSignal.timeout(timeoutMs),
      })
      if (!res.ok) {
        const err = new Error(`HTTP ${res.status} ${res.statusText}`)
        // 4xx 属于确定性错误（地区 ID 不存在等），重试无意义
        if (res.status >= 400 && res.status < 500) err.retryable = false
        throw err
      }
      const body = await res.json()
      if (body?.returnCode !== 0) throw new Error(`接口返回异常：${body?.message ?? 'unknown'}`)
      if (!Array.isArray(body.data)) throw new Error('接口数据结构异常：缺少 data 数组')
      return body.data
    } catch (err) {
      lastErr = err
      if (err?.retryable === false) break
      if (attempt < retries) await new Promise((r) => setTimeout(r, 1200 * (attempt + 1)))
    }
  }
  throw new Error(`请求 ${url} 失败：${lastErr?.message ?? lastErr}`)
}

/* ------------------------------- 数据转换 ------------------------------- */

/**
 * 把接口记录转换为站点使用的三条字段。
 * 与站点渲染逻辑保持一致：String(数值) 不做补零（7.6 而非 7.60），0 记作 "0"。
 */
function toRecord(item) {
  const price = item?.n95
  const change = item?.n95Change
  const date = typeof item?.date === 'string' ? item.date.trim() : ''
  if (!DATE_RE.test(date)) return null
  if (typeof price !== 'number' || !Number.isFinite(price) || price <= 0) return null
  return {
    日期: date,
    价格: `${String(price)}${PRICE_SUFFIX}`,
    涨跌: typeof change === 'number' && Number.isFinite(change) ? String(change) : '0',
  }
}

/* ------------------------------- 合并逻辑 ------------------------------- */

function mergeRecords(local, remote) {
  const localMap = new Map(local.map((r) => [r.日期, r]))
  const merged = new Map(remote.map((r) => [r.日期, r]))

  let added = 0
  let touched = 0
  const conflicts = []
  const keptLocalOnly = []

  for (const [date, row] of merged) {
    if (!localMap.has(date)) added++
  }
  for (const [date, oldRow] of localMap) {
    const newRow = merged.get(date)
    if (!newRow) {
      merged.set(date, oldRow) // 保留接口已下架的历史记录
      keptLocalOnly.push(date)
      continue
    }
    if (newRow.价格 !== oldRow.价格 || newRow.涨跌 !== oldRow.涨跌) {
      touched++
      conflicts.push({ 日期: date, 原: oldRow, 新: newRow })
    }
  }

  const list = [...merged.values()].sort((a, b) => (a.日期 < b.日期 ? 1 : a.日期 > b.日期 ? -1 : 0))
  return { list, added, touched, conflicts, keptLocalOnly }
}

/* --------------------------------- 主流程 -------------------------------- */

async function main() {
  const opts = parseArgs(process.argv.slice(2))

  if (opts.help) {
    console.log(`用法: node scripts/sync-gas-price.mjs [选项]

  --region=<id>      地区 ID，默认 13（安徽）
  --out=<path>       输出文件，默认 src/.vuepress/components/lishiyoujia.json
  --since=<date>     仅保留该日期（含）之后的数据，如 --since=2019-01-01
  --dry-run, -n      只比对不写盘
  --strict           拉取失败时以退出码 1 结束（默认降级为使用本地旧数据）
  --timeout=<ms>     单次请求超时，默认 20000
  --help, -h         显示帮助`)
    return 0
  }

  if (process.env.SKIP_GAS_SYNC === '1') {
    log('SKIP_GAS_SYNC=1，跳过价格同步')
    return 0
  }

  // 读取本地现有数据（缺失或损坏时按空数组处理，不阻塞构建）
  let local = []
  let rawOld = ''
  if (existsSync(opts.out)) {
    try {
      rawOld = await readFile(opts.out, 'utf8')
      const parsed = JSON.parse(rawOld)
      if (Array.isArray(parsed)) local = parsed.filter((r) => r && DATE_RE.test(r.日期 ?? ''))
      else warn('本地 JSON 不是数组，将按空数据处理')
    } catch (err) {
      warn(`本地 JSON 解析失败（${err.message}），将按空数据处理`)
    }
  }

  // 拉取接口数据
  let remoteRaw
  try {
    remoteRaw = await fetchRemote(opts.region, opts.timeout)
  } catch (err) {
    warn(err.message)
    if (opts.strict) {
      warn('已启用 --strict，终止并返回非 0 退出码')
      return 1
    }
    warn(`同步失败，继续使用本地已有数据（${local.length} 条），本次不写盘`)
    return 0
  }

  const remote = remoteRaw.map(toRecord).filter(Boolean)
  if (remote.length === 0) {
    warn('接口返回的记录均为无效数据，本次不写盘')
    return opts.strict ? 1 : 0
  }

  const { list: mergedAll, added, touched, conflicts, keptLocalOnly } = mergeRecords(local, remote)
  const list = opts.since ? mergedAll.filter((r) => r.日期 >= opts.since) : mergedAll

  log(`接口返回 ${remoteRaw.length} 条，有效 ${remote.length} 条`)
  log(`本地现有 ${local.length} 条 → 合并后 ${list.length} 条（新增 ${added} 条，内容变更 ${touched} 条）`)
  log(`区间 ${list[list.length - 1]?.日期 ?? '-'} ~ ${list[0]?.日期 ?? '-'}，最新：${list[0]?.价格 ?? '-'}（${list[0]?.日期 ?? '-'}）`)

  if (conflicts.length) {
    log(`检测到 ${conflicts.length} 条与本地不一致，已按接口数据更新：`)
    for (const c of conflicts.slice(0, 10)) {
      log(`  ${c.日期}: ${c.原.价格}/${c.原.涨跌} → ${c.新.价格}/${c.新.涨跌}`)
    }
  }
  if (keptLocalOnly.length) {
    log(`保留接口未包含的本地历史记录 ${keptLocalOnly.length} 条（最新一条：${keptLocalOnly[0]}）`)
  }

  const next = JSON.stringify(list, null, 2)
  if (next === rawOld) {
    log('数据无变化，跳过写盘')
    return 0
  }
  if (opts.dryRun) {
    log('--dry-run：不写盘，仅演示合并结果')
    return 0
  }

  await writeFile(opts.out, next, 'utf8')
  log(`已写入 ${path.relative(ROOT, opts.out)}（${list.length} 条）`)
  return 0
}

main()
  .then((code) => process.exit(code))
  .catch((err) => {
    // 兜底：任何未捕获异常都不应阻断文档构建
    warn(`未预期的错误：${err?.stack ?? err}`)
    process.exit(process.argv.includes('--strict') ? 1 : 0)
  })
