export interface TeamChatThreadProps {
  channelName: string;
  channelIcon?: string;
  children: React.ReactNode;
  variant?: 'problem' | 'neutral';
}

export default function TeamChatThread({
  channelName,
  channelIcon = '#',
  children,
  variant = 'problem'
}: TeamChatThreadProps) {
  const borderColor = variant === 'problem' ? 'border-red-200' : 'border-zinc-200';
  const headerBg = variant === 'problem' ? 'bg-red-50' : 'bg-zinc-50';

  return (
    <div className={`border ${borderColor} rounded-xl overflow-hidden shadow-sm bg-white`}>
      {/* Channel Header */}
      <div className={`${headerBg} border-b ${borderColor} px-3 py-2`}>
        <div className="flex items-center gap-2">
          <span className="text-zinc-700 font-bold text-sm">{channelIcon}</span>
          <span className="font-semibold text-zinc-900 text-sm">{channelName}</span>
        </div>
      </div>

      {/* Messages Container */}
      <div className="p-3 space-y-0.5 max-h-[240px] overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
