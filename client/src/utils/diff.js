/**
 * Token-based Myers/LCS Diffing Engine.
 * Supports list-item diffing (for skills) and word/punctuation diffing (for experience bullets/summaries).
 */

export function diffTokens(origTokens, newTokens) {
  const dp = Array(origTokens.length + 1)
    .fill(0)
    .map(() => Array(newTokens.length + 1).fill(0));

  for (let i = 1; i <= origTokens.length; i++) {
    for (let j = 1; j <= newTokens.length; j++) {
      if (origTokens[i - 1] === newTokens[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  let i = origTokens.length;
  let j = newTokens.length;
  const result = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && origTokens[i - 1] === newTokens[j - 1]) {
      result.unshift({ type: 'common', value: origTokens[i - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.unshift({ type: 'added', value: newTokens[j - 1] });
      j--;
    } else {
      result.unshift({ type: 'removed', value: origTokens[i - 1] });
      i--;
    }
  }
  return result;
}

/**
 * Diffs standard text using a word-level tokenization.
 * Preserves spaces and punctuation.
 */
export function diffText(original = '', suggested = '') {
  const tokenRegex = /\w+|\s+|[^\w\s]+/g;
  const origTokens = original.match(tokenRegex) || [];
  const sugTokens = suggested.match(tokenRegex) || [];
  return diffTokens(origTokens, sugTokens);
}

/**
 * Diffs list-like text (comma-separated or newline-separated).
 */
export function diffList(original = '', suggested = '') {
  const separator = original.includes(',') ? ',' : '\n';
  const origItems = original
    .split(separator)
    .map((item) => item.trim())
    .filter(Boolean);
  const sugItems = suggested
    .split(separator)
    .map((item) => item.trim())
    .filter(Boolean);

  const diffResult = diffTokens(origItems, sugItems);
  return {
    diffResult,
    separator: separator === ',' ? ', ' : '\n',
  };
}
