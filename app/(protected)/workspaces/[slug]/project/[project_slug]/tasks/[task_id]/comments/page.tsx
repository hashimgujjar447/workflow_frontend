'use client'
import React, { useState } from 'react'
import {
  useGetTaskCommentsQuery,
  useGetTaskQuery,
  useAddCommentMutation,
} from '@/store/services/workspaceApi'
import { useParams } from 'next/navigation'
import CommentCard from '@/components/features/tasks/CommentCard'
import CommentModal from '@/components/features/tasks/AddCommentModel'

const page = () => {
  const params = useParams()

  const [parentId, setParentId] = useState<number | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const { slug, project_slug, task_id } = params as {
    slug: string
    project_slug: string
    task_id: string
  }

  // ✅ Queries
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
  console.log(data)

  // ✅ Mutation
  const [addComment, { isLoading: isSubmitting }] =
    useAddCommentMutation()

  // ✅ Submit Handler
  const handleSubmit = async (formData: any) => {
    try {
      await addComment({
        workspace_slug: slug,
        project_slug,
        task_id,
        content: formData.content,
        parent_comment: parentId, // 👈 IMPORTANT
      }).unwrap()

      // reset
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

      {/* Comments Section */}
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

        {data?.results?.map((comment: any, index: number) => (
          <CommentCard
            key={index}
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
        isSubmitting={isSubmitting} // 👈 optional loading
      />
    </div>
  )
}

export default page