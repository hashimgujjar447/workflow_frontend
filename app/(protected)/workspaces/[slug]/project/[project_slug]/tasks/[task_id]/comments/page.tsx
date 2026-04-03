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
import { useAppSelector } from '@/hooks/hooks'

/* ================= TYPES ================= */

export interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  date_joined: string
}

export interface Comment {
  id: number
  content: string
  created_at: string
  author: User
  parent_comment: number | null
  replies: Comment[]
  likes: number
  dislikes: number
  user_reaction: 'like' | 'dislike' | null
}

export interface PaginatedComments {
  count: number
  next: string | null
  previous: string | null
  results: Comment[]
}

type CommentEvent = {
  id: number
  content: string
  author: string
  author_id: number
  parent_comment: number | null
}

/* ================= COMPONENT ================= */

const Page = () => {
  const params = useParams()
  const socket = useSocket()
  const user = useAppSelector((state) => state.auth.user)

  const [parentId, setParentId] = useState<number | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  // ✅ pagination state
  const [page, setPage] = useState(1)
  const [allComments, setAllComments] = useState<Comment[]>([])

  const { slug, project_slug, task_id } = params as {
    slug: string
    project_slug: string
    task_id: string
  }

  const { data: task, isLoading } = useGetTaskQuery({
    workspace_slug: slug,
    project_slug,
    task_id,
  })

  const { data, isFetching } = useGetTaskCommentsQuery({
    workspace_slug: slug,
    project_slug,
    task_id,
    page,
  }) as { data?: PaginatedComments; isFetching: boolean }

  const [addComment, { isLoading: isSubmitting }] =
    useAddCommentMutation()


  useEffect(() => {
  if (!data?.results) return
 // eslint-disable-next-line react-hooks/set-state-in-effect
  setAllComments((prev) => {
    // ✅ first page → replace
    if (page === 1) {
      // avoid unnecessary re-render
      const isSame =
        prev.length === data.results.length &&
        prev.every((p, i) => p.id === data.results[i]?.id)

      if (isSame) return prev
      return data.results
    }

    // ✅ next pages → merge
    const newItems = data.results.filter(
      (c) => !prev.some((p) => p.id === c.id)
    )

    if (newItems.length === 0) return prev

    return [...prev, ...newItems]
  })
}, [data, page,task_id])


  useEffect(() => {
    if (!socket) return

    const handler = (e: MessageEvent) => {
      const parsed = JSON.parse(e.data)

      if (parsed.event === 'comment_created') {
        if (parsed.author_id === user?.id) return

        const newComment: Comment = {
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

        setAllComments((prev) => {
          const exists = prev.some((c) => c.id === newComment.id)
          if (exists) return prev

         
          if (newComment.parent_comment) {
            return prev.map((c) =>
              c.id === newComment.parent_comment
                ? { ...c, replies: [...c.replies, newComment] }
                : c
            )
          }
          return [newComment, ...prev]
        })
      }
    }

    socket.addEventListener('message', handler)

    return () => {
      socket.removeEventListener('message', handler)
    }
  }, [socket, user])



  const handleSubmit = async (formData: { content: string }) => {
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

  const handleLoadMore = () => {
    if (data?.next) {
      setPage((prev) => prev + 1)
    }
  }


  if (isLoading) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
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

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            💬 Comments ({data?.count || 0})
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

        {allComments.length === 0 && (
          <p className="text-gray-500 text-sm">
            No comments yet...
          </p>
        )}

        {allComments.map((comment) => (
          <CommentCard
            key={comment.id}
            comment={comment}
            onReply={(id: number) => {
              setParentId(id)
              setIsOpen(true)
            }}
          />
        ))}

        {data?.next && (
          <button
            onClick={handleLoadMore}
            disabled={isFetching}
            className="mt-4 w-full bg-gray-100 py-2 rounded-lg hover:bg-gray-200"
          >
            {isFetching ? 'Loading...' : 'Load More'}
          </button>
        )}
      </div>

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