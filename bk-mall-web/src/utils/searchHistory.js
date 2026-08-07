/**
 * 搜索历史管理
 * 基于 localStorage 存储，最多保存 20 条
 */

const HISTORY_KEY = 'bk_mall_search_history'
const MAX_ITEMS = 20

/**
 * 获取搜索历史
 * @returns {string[]}
 */
export function getSearchHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

/**
 * 添加搜索关键词
 * @param {string} keyword
 */
export function addSearchHistory(keyword) {
  if (!keyword || !keyword.trim()) return

  const trimmed = keyword.trim()
  const list = getSearchHistory()

  // 去重：如果已存在，移到最前面
  const index = list.indexOf(trimmed)
  if (index > -1) {
    list.splice(index, 1)
  }

  // 插入到最前面
  list.unshift(trimmed)

  // 限制数量
  if (list.length > MAX_ITEMS) {
    list.pop()
  }

  localStorage.setItem(HISTORY_KEY, JSON.stringify(list))
}

/**
 * 删除单条搜索历史
 * @param {string} keyword
 */
export function removeSearchHistory(keyword) {
  const list = getSearchHistory()
  const index = list.indexOf(keyword)
  if (index > -1) {
    list.splice(index, 1)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(list))
  }
}

/**
 * 清空搜索历史
 */
export function clearSearchHistory() {
  localStorage.removeItem(HISTORY_KEY)
}
