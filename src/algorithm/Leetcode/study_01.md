---
title: 30 天刷题计划（一）
shortTitle: 刷题一
icon: fab fa-markdown
isOriginal: false
date: 2023-1-09
order: 1
category:
  - Leetcode
tag:
  - Leetcode
---

**题目:删除有序数组中的重复项**

> 描述: 给你一个 非严格递增排列 的数组 nums ，请你 原地 删除重复出现的元素，使每个元素 只出现一次 ，返回删除后数组的新长
> 度。元素的 相对顺序 应该保持 一致 。然后返回 nums 中唯一元素的个数。

> 输入：`nums = [0,0,1,1,1,2,2,3,3,4]` 输出：5, `nums = [0,1,2,3,4]` 解释：函数应该返回新的长度 5 ， 并且原数组 nums 的
> 前五个元素被修改为 0, 1, 2, 3, 4 。不需要考虑数组中超出新长度后面的元素。

**题解:**

_难度:简单_

```ts
// 双指针版
function removeDuplicates(nums: number[]): number {
  if (nums.length === 0) {
    return 0;
  }

  let p = 0,
    q = 1;

  while (q < nums.length) {
    if (nums[p] == nums[q]) {
      q++;
    } else {
      nums[p + 1] = nums[q];
      p++;
      q++;
    }
  }
  return p + 1;
}

// let myNums = [0, 0, 1, 1, 1, 2, 2, 3, 3, 4]
// removeDuplicates(myNums)
```

**题目: 交替合并字符串**

> 描述: 给你两个字符串 word1 和 word2 。请你从 word1 开始，通过交替添加字母来合并字符串。如果一个字符串比另一个字符串长
> ，就将多出来的字母追加到合并后字符串的末尾。

> 示例输入：word1 = "ab", word2 = "pqrs" 输出："apbqrs" 解释：注意，word2 比 word1 长，"rs" 需要追加到合并后字符串的末尾
> 。 word1： a b word2： p q r s 合并后： a p b q r s

**题解:** _难度:简单_

```ts
function mergeAlternately(word1: string, word2: string): string {
  let minLength = Math.min(word1.length, word2.length);
  let resultString = "";
  for (let i = 0; i < minLength; i++) {
    resultString += word1[i] + word2[i];
  }
  if (word1.length > word2.length) {
    resultString += word1.slice(minLength, word1.length);
  } else {
    resultString += word2.slice(minLength, word2.length);
  }
  return resultString;
}

// mergeAlternately("ab", "pqrs")
```
