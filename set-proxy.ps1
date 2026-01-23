# git无法提交时, 执行脚本, 设置代理
$env:http_proxy = "http://127.0.0.1:10808"
$env:https_proxy = "http://127.0.0.1:10808"
$env:all_proxy = "socks5://127.0.0.1:10808"

$env:HTTP_PROXY = "http://127.0.0.1:10808"
$env:HTTPS_PROXY = "http://127.0.0.1:10808"
$env:ALL_PROXY = "socks5://127.0.0.1:10808"

Write-Host "✅ 代理已设置（仅当前会话）" -ForegroundColor Green