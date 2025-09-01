"use client"
import { useState } from "react"
import ReactMarkdown from "react-markdown"

export default function EditableField({ value, onSave, isTitle = false, className = "" }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value || "")

  function handleSave() {
    setEditing(false)
    if (draft !== value) {
      onSave(draft)
    }
  }

  return editing ? (
    <input
      type="text"
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={handleSave}
      onKeyDown={(e) => e.key === "Enter" && handleSave()}
      className={`border px-2 py-1 rounded w-full ${
        isTitle ? "text-xl font-bold text-gray-900" : "text-sm"
      } ${className}`}
      autoFocus
    />
  ) : (
    <div
      onClick={() => setEditing(true)}
      className={`cursor-pointer ${
        isTitle
          ? "text-xl font-bold text-gray-900"
          : "text-sm text-gray-600 ml-6 prose prose-sm max-w-none"
      } ${className}`}
    >
      {value ? (
        isTitle ? (
          value
        ) : (
          <ReactMarkdown>{value}</ReactMarkdown>
        )
      ) : isTitle ? (
        "Untitled task"
      ) : (
        "Click to add note..."
      )}
    </div>
  )
}
