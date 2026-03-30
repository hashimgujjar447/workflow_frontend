'use client'

import React, { useEffect, useState } from 'react'
import {
  useGetTaskCommentsQuery,
  useGetTaskQuery,
  useAddCommentMutation,
} from '@/store/services/workspaceApi'
import { useParams } from 'next/navigation'
import CommentCard from '@/components/features/tasks/CommentCard'
import CommentModal from '@/components/features/tasks/AddCommentModel'
import { useSocket } from '@/context/SocketContext'
import { workspaceApi } from '@/store/services/workspaceApi'
import { useAppDispatch } from '@/hooks/hooks'

const Page = () => {
  const params = useParams()
  const socket = useSocket()
  const dispatch = useAppDispatch()

  const [parentId, setParentId] = useState<number | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const { slug, project_slug, task_id } = params as {
    slug: string
    project_slug: string
    task_id: string
  }

  // Queries
  const { data: task, isLoading } = useGetTaskQuery({
    workspace_slug: slug,
    project_slug,
    task_id,
  })

  const { data } = useGetTaskCommentsQuery({
    workspace_slug: slug,
    project_slug,
    task_id,
  })

  // Mutation
  const [addComment, { isLoading: isSubmitting }] =
    useAddCommentMutation()

  // Normalize socket data
  const normalizeComment = (data: any) => ({
    id: data.id,
    content: data.content,
    created_at: new Date().toISOString(),
    author: {
      first_name: data.author,
      last_name: '',
    },
    parent_comment: data.parent_comment,
    replies: [],
    likes: 0,
    dislikes: 0,
    user_reaction: null,
  })

  // Socket listener
  useEffect(() => {
    if (!socket) return

    const handler = (e: MessageEvent) => {
      const data = JSON.parse(e.data)
      console.log('SOCKET DATA:', data)

      if (data.event === 'comment_created') {
        const newComment = normalizeComment(data)

        dispatch(
          workspaceApi.util.updateQueryData(
            'getTaskComments',
            { workspace_slug: slug, project_slug, task_id },
            (draft: any) => {
              if (!draft?.results) return

              // prevent duplicates
              const exists = draft.results.some(
                (c: any) => c.id === newComment.id
              )
              if (exists) return

              let isReply = false

              const addReplyRecursive = (comments: any[]): boolean => {
                for (let c of comments) {
                  if (c.id === newComment.parent_comment) {
                    c.replies.push(newComment)
                    return true
                  }
                  if (addReplyRecursive(c.replies)) return true
                }
                return false
              }

              if (newComment.parent_comment) {
                isReply = addReplyRecursive(draft.results)
              }

              if (!isReply) {
                draft.results.unshift(newComment)
              }
            }
          )
        )
      }
    }

    socket.addEventListener('message', handler)

    return () => {
      socket.removeEventListener('message', handler)
    }
  }, [socket, slug, project_slug, task_id, dispatch])

  // Submit handler
  const handleSubmit = async (formData: any) => {
    try {
      await addComment({
        workspace_slug: slug,
        project_slug,
        task_id,
        content: formData.content,
        parent_comment: parentId,
      }).unwrap()

      setIsOpen(false)
      setParentId(null)
    } catch (err) {
      console.error('Error adding comment:', err)
    }
  }

  if (isLoading) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Task Card */}
      <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {task?.title}
        </h1>

        <p className="text-gray-600 text-sm mb-4">
          {task?.description}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>Status: {task?.status}</span>
          <span>Due: {task?.due_date}</span>
        </div>
      </div>

      {/* Comments */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            💬 Comments
          </h2>

          <button
            onClick={() => {
              setParentId(null)
              setIsOpen(true)
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
          >
            + Add Comment
          </button>
        </div>

        {data?.results?.length === 0 && (
          <p className="text-gray-500 text-sm">
            No comments yet...
          </p>
        )}

        {data?.results?.map((comment: any) => (
          <CommentCard
            key={comment.id}
            comment={comment}
            onReply={(id: number) => {
              setParentId(id)
              setIsOpen(true)
            }}
          />
        ))}
      </div>

      {/* Modal */}
      <CommentModal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false)
          setParentId(null)
        }}
        onSubmit={handleSubmit}
        parentId={parentId}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}

export default Page