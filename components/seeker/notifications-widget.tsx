"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, Check, X, MessageSquare, FileText, Star } from "lucide-react"
import type { Notification } from "@/lib/types"

interface NotificationsWidgetProps {
  notifications: Notification[]
  onMarkAsRead: (notificationId: string) => void
  onDismiss: (notificationId: string) => void
}

export function NotificationsWidget({ notifications, onMarkAsRead, onDismiss }: NotificationsWidgetProps) {
  const [showAll, setShowAll] = useState(false)

  const unreadNotifications = notifications.filter((n) => !n.read)
  const displayNotifications = showAll ? notifications : notifications.slice(0, 5)

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "proposal_received":
        return "bg-blue-100 text-blue-800"
      case "proposal_accepted":
        return "bg-green-100 text-green-800"
      case "proposal_rejected":
        return "bg-red-100 text-red-800"
      case "project_completed":
        return "bg-purple-100 text-purple-800"
      case "message_received":
        return "bg-orange-100 text-orange-800"
      case "review_requested":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "proposal_received":
        return <FileText className="h-4 w-4" />
      case "message_received":
        return <MessageSquare className="h-4 w-4" />
      case "review_requested":
        return <Star className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <CardTitle>Notifications</CardTitle>
            {unreadNotifications.length > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadNotifications.length}
              </Badge>
            )}
          </div>
          {notifications.length > 5 && (
            <Button variant="ghost" size="sm" onClick={() => setShowAll(!showAll)}>
              {showAll ? "Show Less" : "Show All"}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {displayNotifications.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No notifications</p>
        ) : (
          <div className="space-y-3">
            {displayNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 rounded-lg border ${notification.read ? "bg-background" : "bg-muted/50"}`}
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="flex gap-3 flex-1">
                    <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={getNotificationColor(notification.type)} variant="secondary">
                          {notification.type.replace("_", " ")}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {notification.createdAt.toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="font-medium text-sm">{notification.title}</h4>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {!notification.read && (
                      <Button variant="ghost" size="sm" onClick={() => onMarkAsRead(notification.id)}>
                        <Check className="h-3 w-3" />
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => onDismiss(notification.id)}>
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
