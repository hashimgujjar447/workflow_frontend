'use client'

import React, { useState, useEffect } from 'react'
import {
  useGetTaskCommentsQuery,
  useGetTaskQuery,
  useAddCommentMutation,
  workspaceApi,
} from '@/store/services/workspaceApi'
import { useParams, useRouter } from 'next/navigation'
import { useSocket } from '@/context/SocketContext'
import { useAppDispatch, useAppSelector } from '@/hooks/hooks'

import CommentCard from '@/components/features/tasks/CommentCard'
import CommentModal from '@/components/features/tasks/AddCommentModel'

const Page = () => {
  const params = useParams()
  const router = useRouter()
  const socket = useSocket()
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)

  const { slug, project_slug, task_id } = params as {
    slug: string
    project_slug: string
    task_id: string
  }

  const [isOpen, setIsOpen] = useState(false)
  const [parentId, setParentId] = useState<number | null>(null)

  const { data: task, isLoading: taskLoading } = useGetTaskQuery({
    workspace_slug: slug,
    project_slug,
    task_id,
  })

  const {
    data,
    isLoading: commentsLoading,
    error,
  } = useGetTaskCommentsQuery({
    workspace_slug: slug,
    project_slug,
    task_id,
    page: 1,
  })

  const [addComment, { isLoading: isSubmitting }] =
    useAddCommentMutation()

  useEffect(() => {
    if (!socket) return

    const handler = (e: MessageEvent) => {
      const parsed = JSON.parse(e.data)

      if (parsed.event === 'comment_created') {
        if (parsed.author_id === user?.id) return

        const newComment = {
          id: parsed.id,
          content: parsed.content,
          created_at: new Date().toISOString(),
          author: {
            id: parsed.author_id,
            username: '',
            email: '',
            first_name: parsed.author,
            last_name: '',
            date_joined: '',
          },
          parent_comment: parsed.parent_comment,
          replies: [],
          likes: 0,
          dislikes: 0,
          user_reaction: null,
        }

        dispatch(
          workspaceApi.util.updateQueryData(
            'getTaskComments',
            {
              workspace_slug: slug,
              project_slug,
              task_id,
              page: 1,
            },
            (draft: any) => {
              if (!draft?.results) return

              const exists = draft.results.some(
                (c: any) => c.id === newComment.id
              )
              if (exists) return

              if (newComment.parent_comment) {
                const parent = draft.results.find(
                  (c: any) => c.id === newComment.parent_comment
                )
                if (parent) {
                  parent.replies = parent.replies || []
                  parent.replies.push(newComment)
                  return
                }
              }

              draft.results.unshift(newComment)
            }
          )
        )
      }

      if (
        parsed.event === 'comment_reaction_created' ||
        parsed.event === 'comment_reaction_updated' || parsed.event==='comment_reaction_deleted'
      ) {
        dispatch(
          workspaceApi.util.updateQueryData(
            'getTaskComments',
            {
              workspace_slug: slug,
              project_slug,
              task_id,
              page: 1,
            },
            (draft: any) => {
              if (!draft?.results) return

              const updateReaction = (comments: any[]) => {
                for (let comment of comments) {
                  if (comment.id === parsed.comment_id) {
                    comment.likes = parsed.likes
                    comment.dislikes = parsed.dislikes

                    if (parsed.user_id === user?.id) {
                      comment.user_reaction = parsed.reaction
                    }
                  }

                  if (comment.replies?.length) {
                    updateReaction(comment.replies)
                  }
                }
              }

              updateReaction(draft.results)
            }
          )
        )
      }
    }

    socket.addEventListener('message', handler)

    return () => {
      socket.removeEventListener('message', handler)
    }
  }, [socket, user, slug, project_slug, task_id, dispatch])

  const handleSubmit = async (formData: { content: string }) => {
    await addComment({
      workspace_slug: slug,
      project_slug,
      task_id,
      content: formData.content,
      parent_comment: parentId,
    })

    setIsOpen(false)
    setParentId(null)
  }

  const comments = data?.results || []

  if (taskLoading || commentsLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-3 text-center">
        <p className="text-red-500 text-sm font-medium">
          Failed to load comments
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-3 py-2 bg-black text-white rounded text-xs"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-lg font-semibold">Comments</h1>
          <p className="text-xs text-gray-500">{task?.title}</p>
        </div>

        <button
          onClick={() => router.back()}
          className="text-xs text-gray-500 hover:underline"
        >
          Back
        </button>
      </div>

      {comments.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-center">
          <div className="p-3 rounded-full bg-gray-100">💬</div>

          <h2 className="text-sm font-semibold">
            No comments yet
          </h2>

          <p className="text-xs text-gray-500 max-w-xs">
            Start the discussion by adding your first comment.
          </p>

          <button
            onClick={() => setIsOpen(true)}
            className="bg-primary_blue text-white px-4 py-2 rounded-lg text-sm"
          >
            Add Comment
          </button>
        </div>
      ) : (
        <>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => {
                setParentId(null)
                setIsOpen(true)
              }}
              className="bg-primary_blue text-white px-4 py-2 rounded-lg text-xs"
            >
              + Add Comment
            </button>
          </div>

          <div className="space-y-4">
            {comments.map((comment: any) => (
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
        </>
      )}

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