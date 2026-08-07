import request from '@/api/request'

/**
 * AI 客服对话
 * @param {string} message - 用户消息
 * @param {Object} [options] - 可选参数
 * @param {number} [options.userId] - 用户ID
 * @returns {Promise<string>} 客服回复
 */
export function getCustcareAnswer(message, options = {}) {
  return request({
    url: '/user/custcare/answer',
    method: 'get',
    params: { message },
    headers: options.userId ? { userId: options.userId } : {},
  })
}
