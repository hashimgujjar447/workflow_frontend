'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

type SocketContextType = WebSocket | null

const WebSocketContext = createContext<SocketContextType>(null)

export const WebSocketProvider = ({
  children,
  projectSlug,
}: {
  children: React.ReactNode
  projectSlug: string
}) => {
  const [socket, setSocket] = useState<WebSocket | null>(null)

  useEffect(() => {
    if (!projectSlug) return 

    // 🔥 close previous socket
    if (socket) {
      socket.close()
    }

    // 🔥 create new socket
    const newSocket = new WebSocket(
      `${process.env.NEXT_PUBLIC_WS_URL}/${projectSlug}/`
    )

    setSocket(newSocket)

    newSocket.onopen = () => {
      console.log('WS CONNECTED 🔥', projectSlug)
    }

    newSocket.onclose = () => {
      console.log('WS CLOSED ❌')
    }

    newSocket.onerror = (err) => {
      console.error('WS ERROR ❌', err)
    }

    // 🔥 cleanup on unmount or slug change
    return () => {
      newSocket.close()
    }
  }, [projectSlug])

  return (
    <WebSocketContext.Provider value={socket}>
      {children}
    </WebSocketContext.Provider>
  )
}

export const useSocket = () => {
  const socket = useContext(WebSocketContext)

  if (socket === undefined) {
    throw new Error('useSocket must be used within WebSocketProvider')
  }

  return socket
}