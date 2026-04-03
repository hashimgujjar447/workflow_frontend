'use client'

import { WebSocketProvider } from '@/context/SocketContext'
import { useParams } from 'next/navigation'

const ProjectLayout = ({ children }: { children: React.ReactNode }) => {
  const params = useParams()

  const projectSlug = Array.isArray(params?.project_slug)
    ? params.project_slug[0]
    : params?.project_slug

  // 🔄 Loader until slug available
  if (!projectSlug) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 text-lg">Loading project...</p>
      </div>
    )
  }

  return (
    <WebSocketProvider projectSlug={projectSlug}>
      {children}
    </WebSocketProvider>
  )
}

export default ProjectLayout