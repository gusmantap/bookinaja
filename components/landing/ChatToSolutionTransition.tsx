export interface ChatToSolutionTransitionProps {
  text?: string;
}

export default function ChatToSolutionTransition({
  text = "Dengan Bookinaja"
}: ChatToSolutionTransitionProps) {
  return (
    <div className="relative py-4">
      {/* Dotted line background */}
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t-2 border-dashed border-zinc-300"></div>
      </div>

      {/* Center content */}
      <div className="relative flex justify-center">
        <div className="flex items-center gap-2 bg-white px-4 py-1.5 rounded-full border-2 border-green-200 shadow-sm">
          {/* Icon */}
          <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
            <svg
              className="w-3 h-3 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* Text */}
          <span className="text-xs font-semibold text-green-900">{text}</span>

          {/* Down arrow */}
          <svg
            className="w-4 h-4 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
