/**
 * 消息类型枚举
 */
export enum MessageType {
  USER = "user",
  AI = "ai",
}

/**
 * 引用来源接口
 */
export interface Source {
  title: string
  url: string
  id?: number | string  // 可选的唯一标识符
}

/**
 * 消息接口
 */
export interface Message {
  id: string
  type: MessageType
  content: string
  isLoading: boolean
  sources?: Source[]
}
