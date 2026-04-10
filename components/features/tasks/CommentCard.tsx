'use client'
import React, { useState } from 'react'
import { ThumbsUp, ThumbsDown } from 'lucide-react'
import { useAddCommentReactionMutation } from '@/store/services/workspaceApi'
import { useParams } from 'next/navigation'

const MAX_DEPTH = 2

const CommentCard = ({ comment, depth = 0, onReply }: any) => {
  const params = useParams()

  const { slug, project_slug, task_id } = params as {
    slug: string
    project_slug: string
    task_id: string
  }

  const [addReaction] = useAddCommentReactionMutation()
  const [showReplies, setShowReplies] = useState(false)

  const effectiveDepth = depth > MAX_DEPTH ? MAX_DEPTH : depth

  const handleReaction = async (type: string) => {
    try {
      await addReaction({
        workspace_slug: slug,
        project_slug,
        task_id,
        comment_id: comment.id,
        reaction: type,
      })
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div
      className={`rounded-xl p-3 border border-gray-200 transition ${
        effectiveDepth > 0 ? 'mt-3 border-l-2 pl-3 bg-gray-50' : 'mt-3 bg-white'
      }`}
      style={{
        marginLeft: effectiveDepth * 12,
      }}
    >
      <div className="flex items-start gap-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xs font-semibold">
          {comment?.author?.first_name?.[0]}
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-gray-800">
              {comment?.author?.first_name} {comment?.author?.last_name}
            </h3>
            <span className="text-[10px] text-gray-400">
              {new Date(comment?.created_at).toLocaleDateString()}
            </span>
          </div>

          <p className="text-xs text-gray-700 mt-1 leading-relaxed">
            {comment?.content}
          </p>

          <div className="flex items-center gap-4 mt-2 text-[11px] text-gray-500">
            <button
              onClick={() => handleReaction('like')}
              className={`flex items-center gap-1 ${
                comment.user_reaction === 'like'
                  ? 'text-blue-600'
                  : 'hover:text-blue-600'
              }`}
            >
              <ThumbsUp size={14} />
              {comment?.likes}
            </button>

            <button
              onClick={() => handleReaction('dislike')}
              className={`flex items-center gap-1 ${
                comment.user_reaction === 'dislike'
                  ? 'text-red-500'
                  : 'hover:text-red-500'
              }`}
            >
              <ThumbsDown size={14} />
              {comment?.dislikes}
            </button>

            <button
              onClick={() => onReply?.(comment.id)}
              className="hover:text-blue-600"
            >
              Reply
            </button>
          </div>

          {comment?.replies?.length > 0 && (
            <button
              onClick={() => setShowReplies(!showReplies)}
              className="text-[11px] text-blue-500 mt-2"
            >
              {showReplies
                ? 'Hide replies'
                : `View ${comment.replies.length} replies`}
            </button>
          )}

          {showReplies && comment?.replies?.length > 0 && (
            <div className="mt-2">
              {comment.replies.map((reply: any, index: number) => (
                <CommentCard
                  key={index}
                  comment={reply}
                  depth={depth + 1}
                  onReply={onReply}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CommentCard