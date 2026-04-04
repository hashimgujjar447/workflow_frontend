'use client'

import React, { useState } from 'react'
import {
  useGetTaskCommentsQuery,
  useGetTaskQuery,
  useAddCommentMutation,
} from '@/store/services/workspaceApi'
import { useParams, useRouter } from 'next/navigation'
import CommentCard from '@/components/features/tasks/CommentCard'
import CommentModal from '@/components/features/tasks/AddCommentModel'

const Page = () => {
  const params = useParams()
  const router = useRouter()

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

  /* 🔄 LOADING */
  if (taskLoading || commentsLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
      </div>
    )
  }

  /* ❌ ERROR */
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
    <div className=" ">

      {/* 🔝 HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-lg font-semibold">Comments</h1>
          <p className="text-xs text-gray-500">
            {task?.title}
          </p>
        </div>

        <button
          onClick={() => router.back()}
          className="text-xs text-gray-500 hover:underline"
        >
          Back
        </button>
      </div>

      {/* 📭 EMPTY STATE */}
      {comments.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center gap-4">
          
          <div className="p-3 rounded-full bg-gray-100">
            💬
          </div>

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
          {/* ➕ ADD BUTTON (ONLY WHEN COMMENTS EXIST) */}
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

          {/* 💬 COMMENTS LIST */}
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

      {/* 🧾 MODAL */}
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