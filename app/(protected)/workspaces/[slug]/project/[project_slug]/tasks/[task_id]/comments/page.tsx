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
import { useAppDispatch, useAppSelector } from '@/hooks/hooks'

const Page = () => {
  const params = useParams()
  const socket = useSocket()
  const dispatch = useAppDispatch()
  const user=useAppSelector((state)=> state.auth.user)

  const [parentId, setParentId] = useState<number | null>(null)
  const [isOpen, setIsOpen] = useState(false)


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

  const { data } = useGetTaskCommentsQuery({
    workspace_slug: slug,
    project_slug,
    task_id,
  })

  console.log(data)

  const [addComment, { isLoading: isSubmitting }] =
    useAddCommentMutation()

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

  // ✅ move outside for performance
  const commentExists = (arr: any[], id: number): boolean => {
    return arr.some((item) => {
      if (item.id === id) return true
      if (item?.replies?.length) {
        return commentExists(item.replies, id)
      }
      return false
    })
  }

  const addReplyRecursive = (
    comments: any[],
    newComment: any
  ): boolean => {
    for (let c of comments) {
      if (c.id === newComment.parent_comment) {
        c.replies = c.replies || []
        c.replies.push(newComment)
        return true
      }

      if (c?.replies?.length) {
        if (addReplyRecursive(c.replies, newComment)) return true
      }
    }
    return false
  }
const updateLikeRecursive = (comments: any[], data: any): boolean => {
  for (let c of comments) {   

    if (c.id === data.comment_id) {   

      c.likes = data.likes
      c.dislikes = data.dislikes

       if(user?.id===data.user_id){
        // optional (user reaction)
      c.user_reaction = data.reaction
       }

      return true
    }

    if (c?.replies?.length) {
      if (updateLikeRecursive(c.replies, data)) return true
    }
  }
  return false
}

  useEffect(() => {
    if (!socket) return

    const handler = (e: MessageEvent) => {
      const data = JSON.parse(e.data)

      if (data.event === 'comment_created') {
        if(data.author_id===user?.id) return

        const newComment = normalizeComment(data)

        dispatch(
          workspaceApi.util.updateQueryData(
            'getTaskComments',
            { workspace_slug: slug, project_slug, task_id },
            (draft: any) => {
              
              if (!draft?.results) return

              // ✅ prevent duplicates (fixed)
              if (commentExists(draft.results, newComment.id)) return

              let isReply = false

              if (newComment.parent_comment) {
                isReply = addReplyRecursive(
                  draft.results,
                  newComment
                )
              }

              if (!isReply) {
                draft.results.unshift(newComment)
              }
            }
          )
        )
      }else if (
  data.event === 'comment_reaction_created' ||
  data.event === 'comment_reaction_updated' ||
  data.event === 'comment_reaction_deleted'
) {
   console.log(data)
  dispatch(
    workspaceApi.util.updateQueryData(
      'getTaskComments',
      { workspace_slug: slug, project_slug, task_id },
      (draft:any)=>{
        if(!draft.results) return

        updateLikeRecursive(draft.results, data)
      }
    )
  )
}
    }

    socket.addEventListener('message', handler)

    return () => {
      socket.removeEventListener('message', handler)
    }
  }, [socket, slug, project_slug, task_id, dispatch, user])

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