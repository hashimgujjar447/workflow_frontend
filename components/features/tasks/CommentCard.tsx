'use client'
import React from 'react'
import { ThumbsUp, ThumbsDown } from 'lucide-react'

const CommentCard = ({ comment, depth = 0, onReply }: any) => {
  return (
    <div
      className={`bg-white rounded-2xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition duration-200 ${
        depth > 0 ? 'ml-6 mt-3' : 'mt-4'
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">
          {comment?.author?.first_name?.[0]}
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 text-sm">
            {comment?.author?.first_name} {comment?.author?.last_name}
          </h3>
          <span className="text-xs text-gray-500">
            {new Date(comment?.created_at).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Message */}
      <p className="text-gray-700 text-sm leading-relaxed ml-12">
        {comment?.content}
      </p>

      {/* ACTIONS (YouTube style) */}
      <div className="flex items-center gap-4 ml-12 mt-3 text-gray-500 text-sm">
        
        {/* Like */}
        <button className="flex items-center gap-1 hover:text-blue-600 transition">
          <ThumbsUp size={16} />
          <span>0</span>
        </button>

        {/* Dislike */}
        <button className="hover:text-red-500 transition">
          <ThumbsDown size={16} />
        </button>

        {/* Reply */}
        <button
          onClick={() => onReply?.(comment.id)}
          className="font-medium hover:text-blue-600 transition"
        >
          Reply
        </button>
      </div>

      {/* Replies */}
      {comment?.replies?.length > 0 && (
        <div className="mt-3 border-l border-gray-200 pl-4">
          {comment.replies.map((reply: any, index: number) => (
            <CommentCard
              key={index}
              comment={reply}
              depth={depth + 1}
              onReply={onReply} // 👈 important
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default CommentCard