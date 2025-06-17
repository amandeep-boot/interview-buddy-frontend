export function TypingIndicator() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-100"></div>
        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-200"></div>
      </div>
      <span className="text-sm text-gray-400">AI is thinking...</span>
    </div>
  )
}
