import { useNotification } from '../contexts/NotificationContext'

const Notification = () => {
  const { notification } = useNotification()

  if (!notification) return null

  return <div className="notification">{notification}</div>
}

export default Notification
