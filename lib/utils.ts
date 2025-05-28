import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * 合并 Tailwind CSS 类名
 * 使用 clsx 和 tailwind-merge 来处理类名合并
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 格式化聊天消息
 * 处理换行符和特殊字符
 */
export function formatChatMessage(message: string): string {
  return message
    .trim()
    .replace(/\n{3,}/g, '\n\n') // 将连续的3个或更多换行符替换为2个
    .replace(/```/g, '\n```\n'); // 确保代码块前后有换行
}

/**
 * 防抖函数
 * 用于限制函数调用频率
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
