"use client"

import { useRef, useState } from "react"
import {
  Phone,
  Video,
  Search,
  Paperclip,
  Send,
  Camera,
  Check,
  CheckCheck,
  FileText,
} from "lucide-react"
import {LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts"

import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import clsx from "clsx"


type Attachment = {
  id: string
  type: "image" | "file"
  url: string
  name?: string
}

type MessageStatus = "sent" | "delivered" | "read"

type Message = {
  id: string
  sender: "me" | "them"
  text?: string
  time: string
  status: MessageStatus
  attachments?: Attachment[]
}

type Conversation = {
  id: string
  name: string
  avatar: string
  lastMessage: string
  time: string
  unreadCount?: number
  category?: string
  online?: boolean
}

/* MOCK DATA */

const conversations: Conversation[] = [
  {
    id: "1",
    name: "John Smith",
    avatar: "https://i.pravatar.cc/100?img=12",
    lastMessage: "See you later, I’ll let you know.",
    time: "09:45",
    category: "E-commerce",
    online: true,
  },
  {
    id: "2",
    name: "Creative Minds",
    avatar: "https://i.pravatar.cc/100?img=32",
    lastMessage: "Marcus Miller: Do you have time for a call?",
    time: "10:25",
    category: "Mobile App",
  },
  {
    id: "3",
    name: "Anna Roberts",
    avatar: "https://i.pravatar.cc/100?img=45",
    lastMessage: "I’ll confirm the time tomorrow.",
    time: "12:25",
    category: "Web Development",
    online: true,
  },
  {
    id: "4",
    name: "Charles Miller",
    avatar: "https://i.pravatar.cc/100?img=22",
    lastMessage: "Thanks for the document, everything looks good.",
    time: "11:55",
    unreadCount: 20,
  },
]





const initialMessages: Message[] = [
  {
    id: "m1",
    sender: "them",
    text:
      "Hey Emma! I was thinking about the new app interface. Dark theme?",
    time: "09:20",
    status: "read",
  },
  {
    id: "m2",
    sender: "me",
    text:
      "Dark themes feel modern. Accessibility & contrast are key.",
    time: "09:20",
    status: "read",
  },
  {
    id: "m3",
    sender: "them",
    text:
      "I’ll test variations with different contrasts and highlights.",
    time: "09:21",
    status: "delivered",
    attachments: [
      {
        id: "a1",
        type: "image",
        url: "https://images.unsplash.com/photo-1559028012-481c04fa702d",
      },
    ],
  },
]



export default function MessagesPage() {
  const [messageInput, setMessageInput] = useState("")
  const [typing, setTyping] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)


  const sendMessage = () => {
  if (!messageInput.trim()) return

  setMessagesByConversation((prev) => ({
    ...prev,
    [activeConversationId]: [
      ...(prev[activeConversationId] || []),
      {
        id: crypto.randomUUID(),
        sender: "me",
        text: messageInput,
        time: "now",
        status: "sent",
      },
    ],
  }))

  setMessageInput("")
}

  const handleAttachment = (files: FileList | null) => {
  if (!files) return

  const file = files[0]
  const url = URL.createObjectURL(file)

  setMessagesByConversation((prev) => ({
    ...prev,
    [activeConversationId]: [
      ...(prev[activeConversationId] || []),
      {
        id: crypto.randomUUID(),
        sender: "me",
        time: "now",
        status: "sent",
        attachments: [
          {
            id: crypto.randomUUID(),
            type: file.type.startsWith("image") ? "image" : "file",
            url,
            name: file.name,
          },
        ],
      },
    ],
  }))
}


  const [activeConversationId, setActiveConversationId] = useState(conversations[0].id)

  const [messagesByConversation, setMessagesByConversation] = useState<
    Record<string, Message[]>
  >({
    "1": initialMessages,
  })

  const messages: Message[] =
  messagesByConversation[activeConversationId] || []



  const activeConversation = conversations.find(
    (c) => c.id === activeConversationId
  )!


  const StatusIcon = ({ status }: { status: MessageStatus }) => {
    if (status === "sent") return <Check className="h-3 w-3" />
    if (status === "delivered") return <CheckCheck className="h-3 w-3" />
    return <CheckCheck className="h-3 w-3 text-blue-600" />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-orangeButton my-custum-class">Messages</h1>
        <p className="text-gray-500 text-xl">
          Manage your conversations and project inquiries
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6">
        {/* LEFT SIDEBAR */}
        
        <Card className="rounded-2xl p-4 bg-white">
          <div className="h-4">
          <h3 className="font-semibold text-2xl mb-3">
            Messages{" "}
            <span className="ml-1 text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
              27
            </span>
          </h3>
          </div>

          <div className="relative mb-4 h-2 bg-white">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search"
              className="pl-9 rounded-full bg-gray-100"
            />
          </div>

          <div className="space-y-2">
          {conversations.map((c) => (
            <div
          key={c.id}
          onClick={() => {
            setActiveConversationId(c.id)
            c.unreadCount = 0
          }}
          className={clsx(
            "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition",
            activeConversationId === c.id
              ? "bg-blue-50"
              : "hover:bg-gray-100"
          )}
        >
              {/* Avatar */}
              <div className="relative">
                <img
                  src={c.avatar}
                  className="h-10 w-10 rounded-full"
                />
                {c.online && (
                  <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-semibold truncate">
                    {c.name}
                  </p>
                  <span className="text-xs text-gray-400">
                    {c.time}
                  </span>
                </div>

                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-gray-500 truncate max-w-[180px]">
                    {c.lastMessage}
                  </p>

                  {c.category ? (
                    <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full whitespace-nowrap">
                      {c.category}
                    </span>
                  ) : c.unreadCount ? (
                    <span className="text-[11px] bg-blue-600 text-white px-2 py-0.5 rounded-full">
                      {c.unreadCount}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>


        </Card>

        {/* CHAT PANEL */}
        <Card className="rounded-2xl flex flex-col bg-white border-0 shadow-none">
          <div className="flex items-start justify-between bg-[#f9f9f9] px-6 py-4  border-b">
            <div className="flex items-center gap-3">
              <img
                src={activeConversation.avatar}
                className="h-9 w-9 rounded-full"
              />
              <div>
                <p className="font-medium">{activeConversation.name}</p>
                <p className="text-xs text-gray-500">@mary_johnson</p>
              </div>
            </div>
            <div className="flex gap-10">
              <Phone className="h-5 w-5 text-blue-600" />
              <Video className="h-5 w-5 text-blue-600" />
              <span className="text-xs bg-green-500 text-white px-3 py-1 rounded-full">
                Active
              </span>
            </div>
          </div>

          <div className="flex-1 px-6 py-4 space-y-5 overflow-y-auto">
            {messages.map((msg: Message) => (
              <div
                key={msg.id}
                className={clsx(
                  "flex",
                  msg.sender === "me"
                    ? "justify-end"
                    : "justify-start"
                )}
              >
                <div className="max-w-[70%]">
                  <div
                    className={clsx(
                      "rounded-2xl px-4 py-3 text-sm",
                      msg.sender === "me"
                        ? "bg-blue-100"
                        : "bg-gray-100"
                    )}
                  >
                    {msg.text}

                    {msg.attachments?.map((att: Attachment) => (
                      <div key={att.id} className="mt-2">
                        {att.type === "image" ? (
                          <img
                            src={att.url}
                            className="rounded-lg max-h-40"
                          />
                        ) : (
                          <div className="flex items-center gap-2 text-xs bg-white p-2 rounded-lg">
                            <FileText className="h-4 w-4" />
                            {att.name}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-end gap-1 text-[10px] text-gray-400 mt-1">
                    {msg.sender === "me" && (
                      <StatusIcon status={msg.status} />
                    )}
                    {msg.time}
                  </div>
                </div>
              </div>
            ))}

            {typing && (
              <p className="text-xs text-gray-400">Typing…</p>
            )}
          </div>

          <div className="px-6 py-4 border-t">
            <div className="flex items-center gap-3 bg-gray-50 rounded-full px-4 py-2">
              <Paperclip
                className="h-5 w-5 text-blue-600 cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              />
              <input
                ref={fileInputRef}
                type="file"
                hidden
                onChange={(e) =>
                  handleAttachment(e.target.files)
                }
              />
              <Input
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onFocus={() => setTyping(true)}
                onBlur={() => setTyping(false)}
                placeholder="Message"
                className="border-0 bg-transparent focus-visible:ring-0"
              />
              <Camera className="h-5 w-5 text-blue-600" />
              <Send
                className="h-5 w-5 text-blue-600 cursor-pointer"
                onClick={sendMessage}
              />
            </div>
          </div>
        </Card>

      </div>
    </div>
  )
}
