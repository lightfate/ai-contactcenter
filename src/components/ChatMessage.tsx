import React, { useState, useEffect, useRef } from 'react';
import { FiCopy, FiThumbsUp, FiThumbsDown, FiRefreshCw, FiCheckCircle, FiLoader } from 'react-icons/fi';

// 定义引用类型
type Reference = {
  name: string;
  url: string;
};

// 定义节点状态类型
type FlowNodeStatus = {
  status: string;
  name: string;
};

// 定义组件属性
interface ChatMessageProps {
  content: string;
  references?: Reference[];
  isLoading?: boolean;
  isStreaming?: boolean;
  streamingContent?: string;
  flowNodeStatus?: FlowNodeStatus | null;
  completedSteps?: string[];
  activeSteps?: string[];
  allSteps?: string[];
  onCopy?: () => void;
  onLike?: () => void;
  onDislike?: () => void;
  onRefresh?: () => void;
  className?: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  content,
  references = [],
  isLoading = false,
  isStreaming = false,
  streamingContent = '',
  flowNodeStatus = null,
  completedSteps = [],
  activeSteps = [],
  allSteps = [],
  onCopy,
  onLike,
  onDislike,
  onRefresh,
  className = '',
}) => {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const messageRef = useRef<HTMLDivElement>(null);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [showLoading, setShowLoading] = useState(isLoading);

  // 清理状态信息 - 移除开头的JSON状态字符串
  const cleanContent = (text: string): string => {
    if (!text) return '';
    
    // 移除开头的所有JSON状态对象 {"status":"running","name":"xxx"}
    return text.replace(/^\s*(\{"status":"[^"]+","name":"[^"]+"}\s*)+/, '');
  };

  // 显示的内容：如果在流式输出中，显示流式内容；如果加载中，显示空；否则显示完整内容
  const displayContent = isStreaming ? cleanContent(streamingContent) : (isLoading ? '' : cleanContent(content));

  // 使用延迟显示加载状态，避免短暂请求闪烁
  useEffect(() => {
    if (isLoading) {
      loadingTimeoutRef.current = setTimeout(() => {
        setShowLoading(true);
      }, 300); // 300ms延迟，避免短请求的闪烁
    } else {
      setShowLoading(false);
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
    }

    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
    };
  }, [isLoading]);

  // 处理复制功能
  const handleCopy = () => {
    if (displayContent) {
      navigator.clipboard.writeText(displayContent)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
          if (onCopy) onCopy();
        })
        .catch((err) => console.error('复制失败:', err));
    }
  };

  // 处理点赞功能
  const handleLike = () => {
    if (disliked) setDisliked(false);
    setLiked(!liked);
    if (onLike) onLike();
  };

  // 处理点踩功能
  const handleDislike = () => {
    if (liked) setLiked(false);
    setDisliked(!disliked);
    if (onDislike) onDislike();
  };

  // 处理刷新功能
  const handleRefresh = () => {
    if (onRefresh) onRefresh();
  };

  // 当流式内容更新时，自动滚动到底部
  useEffect(() => {
    if (isStreaming && messageRef.current) {
      messageRef.current.scrollTop = messageRef.current.scrollHeight;
    }
  }, [streamingContent, isStreaming]);

  // 获取步骤状态
  const getStepStatus = (step: string) => {
    if (completedSteps.includes(step)) return 'completed';
    if (activeSteps.includes(step)) return 'active';
    return 'pending';
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-4 mb-4 ${className}`}>
      {/* 进度条 - 始终显示，不再有条件判断 */}
      {allSteps.length > 0 && (
        <div className="mb-4">
          {/* 进度步骤 */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-2">
              {allSteps.map((step, index) => {
                const status = getStepStatus(step);
                return (
                  <div key={step} className="flex flex-col items-center flex-1">
                    <div 
                      className={`flex items-center justify-center w-8 h-8 rounded-full mb-1 
                        ${status === 'completed' ? 'bg-green-100 text-green-600' : 
                          status === 'active' ? 'bg-blue-100 text-blue-600 animate-pulse' : 
                          'bg-gray-100 text-gray-400'}`}
                    >
                      {status === 'completed' ? (
                        <FiCheckCircle size={16} />
                      ) : status === 'active' ? (
                        <FiLoader size={16} className="animate-spin" />
                      ) : (
                        <span className="text-xs">{index + 1}</span>
                      )}
                    </div>
                    <span className={`text-xs text-center ${
                      status === 'completed' ? 'text-green-600' : 
                      status === 'active' ? 'text-blue-600 font-medium' : 
                      'text-gray-400'
                    }`}>
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
            
            {/* 进度条 */}
            <div className="relative h-1.5 bg-gray-200 rounded-full overflow-hidden">
              {allSteps.map((step, index) => {
                // 计算进度条覆盖的宽度百分比
                const stepWidth = 100 / allSteps.length;
                const isCompleted = completedSteps.includes(step);
                const isActive = activeSteps.includes(step);
                
                return isCompleted || isActive ? (
                  <div 
                    key={step}
                    className={`absolute h-full ${isActive ? 'bg-blue-500' : 'bg-green-500'}`}
                    style={{ 
                      left: `${index * stepWidth}%`, 
                      width: `${stepWidth}%`,
                      transition: 'all 0.3s ease'
                    }}
                  />
                ) : null;
              })}
            </div>
          </div>

          {/* 当前步骤文本 - 仅当加载或流式处理时显示 */}
          {(showLoading || isStreaming) && flowNodeStatus && (
            <div className="text-center text-sm text-gray-600 mb-2">
              {showLoading ? (
                <div className="flex flex-col items-center p-2">
                  <div className="text-gray-600 mb-2">正在查阅资料中，请稍后....</div>
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <>正在{flowNodeStatus.name}中</>
              )}
            </div>
          )}
        </div>
      )}

      {/* 加载状态 - 无进度条时显示 */}
      {showLoading && allSteps.length === 0 && (
        <div className="flex flex-col items-center p-4">
          <div className="text-gray-600 mb-2">正在查阅资料中，请稍后....</div>
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* 消息内容 */}
      {!showLoading && (
        <div 
          ref={messageRef}
          className="whitespace-pre-wrap text-gray-800 mb-4 max-h-96 overflow-y-auto"
        >
          {displayContent}
          {isStreaming && (
            <span className="animate-pulse inline-block ml-1 h-4 w-2 bg-blue-500"></span>
          )}
        </div>
      )}

      {/* 只有当不在加载状态且有引用或不在流式输出时显示底部功能区 */}
      {!showLoading && !isStreaming && (
        <div className="mt-4">
          {/* 引用内容 */}
          {references.length > 0 && (
            <div className="mt-2 mb-4">
              <div className="text-sm text-gray-500 mb-1">引用资料：</div>
              <div className="pl-2 border-l-2 border-gray-300">
                {references.map((ref, index) => (
                  <div key={index} className="text-sm mb-1">
                    {ref.url ? (
                      <a 
                        href={ref.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {ref.name}
                      </a>
                    ) : (
                      <span>{ref.name}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 功能按钮 */}
          <div className="flex justify-between items-center pt-2 border-t border-gray-200">
            <div className="text-xs text-gray-500">本答案由AI生成，仅供参考</div>
            <div className="flex space-x-3">
              <button 
                onClick={handleCopy}
                className="text-gray-600 hover:text-blue-500 transition-colors"
                title="复制内容"
              >
                <FiCopy size={18} />
                {copied && <span className="ml-1 text-xs">已复制</span>}
              </button>
              <button 
                onClick={handleLike}
                className={`hover:text-blue-500 transition-colors ${
                  liked ? 'text-blue-500' : 'text-gray-600'
                }`}
                title="点赞"
              >
                <FiThumbsUp size={18} />
              </button>
              <button 
                onClick={handleDislike}
                className={`hover:text-red-500 transition-colors ${
                  disliked ? 'text-red-500' : 'text-gray-600'
                }`}
                title="点踩"
              >
                <FiThumbsDown size={18} />
              </button>
              <button 
                onClick={handleRefresh}
                className="text-gray-600 hover:text-green-500 transition-colors"
                title="刷新回答"
              >
                <FiRefreshCw size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessage; 