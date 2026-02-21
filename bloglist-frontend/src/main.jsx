import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

import { NotificationProvider } from './contexts/NotificationContext'
import { UserProvider } from './contexts/UserContext'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <NotificationProvider>
      <UserProvider>
        <App />
      </UserProvider>
    </NotificationProvider>
  </QueryClientProvider>
)
