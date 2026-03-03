import { useState, useRef, useEffect, useCallback } from 'react'

interface EditableCellProps {
  value: string
  isEdited: boolean
  onSave: (value: string) => void
}

export function EditableCell({ value, isEdited, onSave }: EditableCellProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleSave = useCallback(() => {
    setIsEditing(false)
    if (editValue !== value) {
      onSave(editValue)
    }
  }, [editValue, value, onSave])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleSave()
      } else if (e.key === 'Escape') {
        setEditValue(value)
        setIsEditing(false)
      }
    },
    [handleSave, value],
  )

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className="w-full px-1 py-0 text-sm border border-blue-400 rounded outline-none bg-white"
      />
    )
  }

  return (
    <div
      onDoubleClick={() => {
        setEditValue(value)
        setIsEditing(true)
      }}
      className={`px-2 py-1 text-sm truncate cursor-default ${isEdited ? 'bg-yellow-100' : ''}`}
      title={value}
    >
      {value}
    </div>
  )
}
