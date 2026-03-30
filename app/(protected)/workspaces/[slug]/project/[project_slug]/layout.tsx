'use client'

import { WebSocketProvider } from '@/context/SocketContext'
import { useParams } from 'next/navigation'

const ProjectLayout = ({ children }: { children: React.ReactNode }) => {
  const params = useParams()

  return (
    <WebSocketProvider projectSlug={params?.project_slug}>
      {children}
    </WebSocketProvider>
  )
}

export default ProjectLayout