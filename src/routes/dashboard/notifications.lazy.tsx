import { createLazyFileRoute } from '@tanstack/react-router'
import NotificationsContent from '../../sections/dashboard/notifications/NotificationsContent'

export const Route = createLazyFileRoute('/dashboard/notifications')({
  component: NotificationsContent,
})
