/**
 * 検索機能の管理ロジック
 */

/**
 * Google Suggestから検索候補を取得
 */
export async function fetchSearchSuggestions(keyword, signal) {
  if (!keyword) return [];

  try {
    const url = `https://www.google.com/complete/search?client=youtube&hl=ja&ds=yt&q=${encodeURIComponent(keyword)}`;
    const res = await fetch(url, { signal });

    if (!res.ok) throw new Error('Network error');
    const data = await res.json();
    return data || [];
  } catch (e) {
    if (e.name !== 'AbortError') {
      console.error('fetchSearchSuggestions error', e);
    }
    return [];
  }
}

/**
 * 選択インデックスを移動
 */
export function moveSelectionIndex(current, delta, total) {
  if (total === 0) return -1;

  let next = current + delta;
  if (next < 0) next = total - 1;
  if (next >= total) next = 0;

  return next;
}
