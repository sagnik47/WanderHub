interface ChatMessageContentProps {
  content: string
}

export function ChatMessageContent({ content }: ChatMessageContentProps) {
  const lines = content.split("\n")

  return (
    <div className="text-sm whitespace-pre-wrap break-words overflow-wrap-anywhere">
      {lines.map((line, lineIndex) => {
        const parts = line.split(/(\*\*[^*]+\*\*)/g)

        return (
          <span key={`${line}-${lineIndex}`}>
            {parts.map((part, partIndex) => {
              const isBold = part.startsWith("**") && part.endsWith("**") && part.length > 4
              if (!isBold) return <span key={`${part}-${partIndex}`}>{part}</span>

              return <strong key={`${part}-${partIndex}`}>{part.slice(2, -2)}</strong>
            })}
            {lineIndex < lines.length - 1 && <br />}
          </span>
        )
      })}
    </div>
  )
}
