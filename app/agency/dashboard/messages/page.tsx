"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Building2,
  FileText,
  Star,
  TrendingUp,
  DollarSign,
  Calendar,
  MessageSquare,
  Award,
  Edit,
  Settings,
  BarChart3,
  Users,
  Megaphone,
  CreditCard,
  Bell,
  UserPlus,
  ChevronDown,
  ChevronRight,
  Home,
  User,
  Briefcase,
  MessageCircle,
  FileSearch,
  Eye,
  GitCompare,
  Download,
  Phone,
  Video,
  Paperclip,
  Send,
  Mail,
  Clock,
  CheckCircle,
  X,
  Target,
  Handshake,
} from "lucide-react"
import { mockNotifications, mockProviderProjects, mockProviderReviews, mockRequirements } from "@/lib/mock-data"
import type { Provider, Requirement, Notification, Project, Review } from "@/lib/types"
import { useState } from "react"

const MessagesPage=()=>{
    const [selectedConversation, setSelectedConversation] = useState<string>("john-doe")
      const [newMessage, setNewMessage] = useState("")
      const [conversations, setConversations] = useState([
        {
          id: "john-doe",
          name: "John Doe",
          initials: "JD",
          message: "Thanks for the proposal. When can we start?",
          time: "2m ago",
          project: "E-commerce",
          unread: true,
          color: "bg-blue-500",
          messages: [
            {
              id: "1",
              sender: "client",
              content:
                "Hi! I'm interested in your e-commerce development services. Could you provide a quote for a full online store?",
              timestamp: "Yesterday, 2:30 PM",
              avatar: "JD",
            },
            {
              id: "2",
              sender: "agency",
              content:
                "Hello John! Thanks for reaching out. I'd be happy to help with your e-commerce project. Could you share more details about your requirements?",
              timestamp: "Yesterday, 3:00 PM",
              avatar: "S",
            },
            {
              id: "3",
              sender: "client",
              content:
                "I need a store with about 200 products, payment integration, inventory management, and mobile-responsive design. What would be your timeline and pricing?",
              timestamp: "Yesterday, 4:15 PM",
              avatar: "JD",
            },
            {
              id: "4",
              sender: "agency",
              content:
                "Perfect! Based on your requirements, I can provide a comprehensive solution. I'll send you a detailed proposal with timeline and pricing within 24 hours.",
              timestamp: "Yesterday, 5:30 PM",
              avatar: "S",
            },
            {
              id: "5",
              sender: "client",
              content: "Thanks for the proposal. When can we start?",
              timestamp: "2 minutes ago",
              avatar: "JD",
            },
          ],
        },
        {
          id: "sarah-wilson",
          name: "Sarah Wilson",
          initials: "SW",
          message: "Could you provide more details about the timeline?",
          time: "1h ago",
          project: "Mobile App",
          unread: true,
          color: "bg-purple-500",
          messages: [
            {
              id: "1",
              sender: "client",
              content: "Could you provide more details about the timeline?",
              timestamp: "1 hour ago",
              avatar: "SW",
            },
          ],
        },
        {
          id: "tech-startup",
          name: "Tech Startup Inc",
          initials: "TS",
          message: "We're interested in your web development services",
          time: "3h ago",
          project: "Web Development",
          unread: false,
          color: "bg-orange-500",
          messages: [
            {
              id: "1",
              sender: "client",
              content: "We're interested in your web development services",
              timestamp: "3 hours ago",
              avatar: "TS",
            },
          ],
        },
        {
          id: "marketing-pro",
          name: "Marketing Pro",
          initials: "MP",
          message: "The design looks great! Let's proceed.",
          time: "1d ago",
          project: "Branding",
          unread: false,
          color: "bg-green-500",
          messages: [
            {
              id: "1",
              sender: "client",
              content: "The design looks great! Let's proceed.",
              timestamp: "1 day ago",
              avatar: "MP",
            },
          ],
        },
        {
          id: "david-chen",
          name: "David Chen",
          initials: "DC",
          message: "Can we schedule a call to discuss the project?",
          time: "2d ago",
          project: "Consulting",
          unread: true,
          color: "bg-red-500",
          messages: [
            {
              id: "1",
              sender: "client",
              content: "Can we schedule a call to discuss the project?",
              timestamp: "2 days ago",
              avatar: "DC",
            },
          ],
        },
      ])
    
      const handleConversationSelect = (conversationId: string) => {
        setSelectedConversation(conversationId)
        // Mark conversation as read
        setConversations((prev) => prev.map((conv) => (conv.id === conversationId ? { ...conv, unread: false } : conv)))
      }
    
      const handleSendMessage = async () => {
        if (!newMessage.trim()) return
    
        const selectedConv = conversations.find((c) => c.id === selectedConversation)
        if (!selectedConv) return
    
        const newMsg = {
          id: Date.now().toString(),
          sender: "agency" as const,
          content: newMessage,
          timestamp: "Just now",
          avatar: "S",
        }
    
        // Update conversations with new message
        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === selectedConversation
              ? {
                  ...conv,
                  messages: [...conv.messages, newMsg],
                  message: newMessage,
                  time: "Just now",
                }
              : conv,
          ),
        )
    
        setNewMessage("")
    
        // TODO: Send to backend API
        try {
          const response = await fetch("/api/messages", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              conversationId: selectedConversation,
              message: newMessage,
              sender: "agency",
            }),
          })
    
          if (!response.ok) {
            console.error("Failed to send message")
          }
        } catch (error) {
          console.error("Error sending message:", error)
        }
      }
      const handleKeyPress = (e: React.KeyboardEvent) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
          }
        }
      
        const selectedConv = conversations.find((c) => c.id === selectedConversation)
        const unreadCount = conversations.filter((c) => c.unread).length
    return(
          <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Messages</h1>
                  <p className="text-muted-foreground">Manage your conversations and project inquiries</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Conversations List */}
                  <div className="lg:col-span-1">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>Conversations</span>
                          <Badge variant="secondary">{unreadCount}</Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="space-y-0">
                          {conversations.map((conversation) => (
                            <div
                              key={conversation.id}
                              onClick={() => handleConversationSelect(conversation.id)}
                              className={`p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors ${
                                selectedConversation === conversation.id ? "bg-muted/50" : ""
                              }`}
                            >
                              <div className="flex items-start space-x-3">
                                <div
                                  className={`w-10 h-10 ${conversation.color} rounded-full flex items-center justify-center text-white font-semibold`}
                                >
                                  {conversation.initials}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <p className={`text-sm ${conversation.unread ? "font-semibold" : "font-medium"}`}>
                                      {conversation.name}
                                    </p>
                                    <span className="text-xs text-muted-foreground">{conversation.time}</span>
                                  </div>
                                  <p
                                    className={`text-sm text-muted-foreground truncate ${conversation.unread ? "font-medium" : ""}`}
                                  >
                                    {conversation.message}
                                  </p>
                                  <div className="flex items-center mt-1 space-x-2">
                                    <Badge variant="outline" className="text-xs">
                                      {conversation.project}
                                    </Badge>
                                    {conversation.unread && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Message Thread */}
                  <div className="lg:col-span-2">
                    {selectedConv ? (
                      <Card className="h-[600px] flex flex-col">
                        <CardHeader className="border-b">
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-10 h-10 ${selectedConv.color} rounded-full flex items-center justify-center text-white font-semibold`}
                            >
                              {selectedConv.initials}
                            </div>
                            <div>
                              <CardTitle className="text-lg">{selectedConv.name}</CardTitle>
                              <p className="text-sm text-muted-foreground">{selectedConv.project} Project</p>
                            </div>
                            <div className="ml-auto flex items-center space-x-2">
                              <Badge variant="outline">Active</Badge>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  // TODO: Implement phone call functionality
                                  console.log("Initiating phone call...")
                                }}
                              >
                                <Phone className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  // TODO: Implement video call functionality
                                  console.log("Initiating video call...")
                                }}
                              >
                                <Video className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="flex-1 p-4 overflow-y-auto">
                          <div className="space-y-4">
                            {selectedConv.messages.map((message) => (
                              <div
                                key={message.id}
                                className={`flex items-start space-x-3 ${
                                  message.sender === "agency" ? "justify-end" : ""
                                }`}
                              >
                                {message.sender === "client" && (
                                  <div
                                    className={`w-8 h-8 ${selectedConv.color} rounded-full flex items-center justify-center text-white text-sm font-semibold`}
                                  >
                                    {message.avatar}
                                  </div>
                                )}
                                <div className={`flex-1 ${message.sender === "agency" ? "flex justify-end" : ""}`}>
                                  <div
                                    className={`p-3 rounded-lg max-w-md ${
                                      message.sender === "agency" ? "bg-primary text-primary-foreground" : "bg-muted"
                                    }`}
                                  >
                                    <p className="text-sm">{message.content}</p>
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-1">{message.timestamp}</p>
                                </div>
                                {message.sender === "agency" && (
                                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                    {message.avatar}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </CardContent>

                        {/* Message Input */}
                        <div className="border-t p-4">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                // TODO: Implement file attachment
                                console.log("Opening file picker...")
                              }}
                            >
                              <Paperclip className="h-4 w-4" />
                            </Button>
                            <Input
                              placeholder="Type your message..."
                              className="flex-1"
                              value={newMessage}
                              onChange={(e:any) => setNewMessage(e.target.value)}
                              onKeyPress={handleKeyPress}
                            />
                            <Button size="sm" onClick={handleSendMessage} disabled={!newMessage.trim()}>
                              <Send className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ) : (
                      <Card className="h-[600px] flex items-center justify-center">
                        <div className="text-center">
                          <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground">Select a conversation to start messaging</p>
                        </div>
                      </Card>
                    )}
                  </div>
                </div>
              </div>
    )
}
export default MessagesPage;