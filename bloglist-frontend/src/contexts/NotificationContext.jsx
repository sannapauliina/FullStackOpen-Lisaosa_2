import { createContext, useContext } from 'react'
import { notifications } from '@mantine/notifications'

const NotificationContext = createContext()

export const NotificationProvider = ({ children }) => {
  const showNotification = (message, type = 'info') => {
    notifications.show({
      message,
      color: type === 'error' ? 'red' : type === 'success' ? 'green' : 'blue'
    })
  }

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotification = () => useContext(NotificationContext)
