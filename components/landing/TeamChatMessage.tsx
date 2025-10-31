export interface TeamChatMessageProps {
  author: string;
  avatar: string;
  avatarColor: string;
  message: string;
  timestamp: string;
  isHighlight?: boolean;
}

export default function TeamChatMessage({
  author,
  avatar,
  avatarColor,
  message,
  timestamp,
  isHighlight = false
}: TeamChatMessageProps) {
  return (
    <div className={`flex items-start gap-2.5 py-1.5 px-2.5 rounded-lg transition ${
      isHighlight ? 'bg-red-50 border border-red-200' : 'hover:bg-zinc-50'
    }`}>
      <div className={`w-7 h-7 rounded flex items-center justify-center flex-shrink-0 ${avatarColor}`}>
        <span className="text-xs font-semibold text-white">{avatar}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-0.5">
          <span className="text-sm font-semibold text-zinc-900">{author}</span>
          <span className="text-xs text-zinc-500">{timestamp}</span>
        </div>
        <p className="text-sm text-zinc-700 leading-snug">{message}</p>
      </div>
    </div>
  );
}
