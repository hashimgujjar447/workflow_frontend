'use client'
import React, { useState } from 'react'

const CommentModal = ({ isOpen, onClose, onSubmit,isSubmitting, parentId = null }: any) => {
  const [content, setContent] = useState('')

  if (!isOpen) return null

  const handleSubmit = () => {
    if (!content.trim()) return

    onSubmit({
      content,
      parent: parentId, // 👈 reply ke liye
    })

    setContent('')
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-lg">
        
        <h2 className="text-lg font-semibold mb-4">
          {parentId ? 'Reply' : 'Add Comment'}
        </h2>

        <textarea
          className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
          placeholder="Write your comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg border"
          >
            Cancel
          </button>

         <button
  onClick={handleSubmit}
  disabled={isSubmitting}
  className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
>
  {isSubmitting ? 'Posting...' : 'Submit'}
</button>
        </div>
      </div>
    </div>
  )
}

export default CommentModal