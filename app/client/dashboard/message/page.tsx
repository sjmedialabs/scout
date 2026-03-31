"use client";

import { useRef, useState, useEffect, use } from "react";
import { Pencil, Trash2 } from "lucide-react";
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
  MoveLeft,
} from "lucide-react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import clsx from "clsx";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { authFetch } from "@/lib/auth-fetch";
import { io } from "socket.io-client";
import { Button } from "@/components/ui/button";
import ReportContentModal from "@/components/report-modal";

type Attachment = {
  id: string;
  type: "image" | "file";
  url: string;
  name?: string;
};

type MessageStatus = "sent" | "delivered" | "read";

type Message = {
  _id: string;
  senderId: string;
  sender: "me" | "them";
  text?: string;
  time: string;
  status: MessageStatus;
  attachments?: Attachment[];
  createdAt: string;
  content?: string;
  messageType?: string;
  isRead?: boolean;
};

type Conversation = {
  conversationId: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unreadCount?: number;
  category?: string;
  online?: boolean;
  participant?: {
    name: string;
    image: string;
  };
  participantsAre?: string[];
  lastMessageAt?: string;
};

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
  // ... other mock data (kept as is)
];

const initialMessages: Message[] = [
  {
    _id: "m1",
    sender: "them",
    text: "Hey Emma! I was thinking about the new app interface. Dark theme?",
    time: "09:20",
    status: "read",
    createdAt: new Date().toISOString(),
  },
  // ... other mock messages
];

export default function MessagesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [messageInput, setMessageInput] = useState("");
  const [typing, setTyping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);

  const searchParams = useSearchParams();
  const agencyId = searchParams.get("agencyId");
  const [dynamicConversation, setDynamicConversation] = useState<Conversation[]>([]);
  const [filteredDynamicConversation, setFileteredDynamicConversation] = useState<Conversation[]>([]);
  const [dynamicActiveConversation, setDynamicActiveConversation] = useState<any | null>(null);
  const [dynamicMessages, setDynamicMessages] = useState<Message[]>([]);
  const [messageRecieverId, setMessageRecieverId] = useState();
  const [totalUnreadMessagesCount, setTotalUnreadMessagesCount] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);

  const [resLoading, setResLoading] = useState(false);
  const [chatLaoding, setChatLoading] = useState(false);
  const [sendMsgLoading, setSendMsgLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const socketRef = useRef<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const conversationIdFromUrl = searchParams.get("conversationId");

  const formatDateLabel = (dateString: string) => {
    const msgDate = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isToday = msgDate.toDateString() === today.toDateString();
    const isYesterday = msgDate.toDateString() === yesterday.toDateString();

    if (isToday) return "Today";
    if (isYesterday) return "Yesterday";

    return msgDate.toLocaleDateString([], {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Socket Initialization
  useEffect(() => {
    if (socketRef.current) return;

    socketRef.current = io(
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000",
      {
        path: "/socket.io",
        transports: ["websocket"],
      }
    );

    socketRef.current.on("connect", () => {
      console.log("✅ Socket connected:", socketRef.current.id);
    });

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, []);

  const loadData = async () => {
    setResLoading(true);
    setFailed(false);
    try {
      const res = await authFetch("/api/chat/conversation");
      if (!res.ok) throw new Error();
      const data = await res.json();
      const allConversations = data.conversations || [];

      setDynamicConversation(allConversations);
      setFileteredDynamicConversation(allConversations);

      let totalUnreadCount = 0;
      allConversations.forEach((eachItem: any) => {
        totalUnreadCount += eachItem.unreadCount || 0;
      });
      setTotalUnreadMessagesCount(totalUnreadCount);

      if (allConversations.length > 0) {
        if (conversationIdFromUrl) {
          const found = allConversations.find((c: any) => c.conversationId === conversationIdFromUrl);
          if (found) {
            setDynamicActiveConversation(found);
            await fetchMessages(found.conversationId);
            return;
          }
        }

        const firstConv = allConversations[0];
        setDynamicActiveConversation(firstConv);
        await fetchMessages(firstConv.conversationId);
      }
    } catch (err) {
      console.log(err);
      setFailed(true);
    } finally {
      setResLoading(false);
    }
  };

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [dynamicMessages]);

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 1024);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  useEffect(() => {
    if (!conversationIdFromUrl) return;
    const foundConversation = dynamicConversation.find(
      (c: any) => c.conversationId === conversationIdFromUrl
    );
    if (foundConversation) {
      setDynamicActiveConversation(foundConversation);
      fetchMessages(foundConversation.conversationId);
    }
  }, [conversationIdFromUrl, dynamicConversation]);

  useEffect(() => {
    const saved = localStorage.getItem("chatFavorites");
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("chatFavorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    if (!loading && (!user || user.role !== "client")) {
      router.push("/login");
    }
    if (user && user.role === "client") {
      loadData();
    }
  }, [user, loading, router]);

  // Socket listener for new messages
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !dynamicActiveConversation?.conversationId) return;

    socket.emit("join-conversation", dynamicActiveConversation.conversationId);

    const handler = (payload: any) => {
      setDynamicMessages((prev) => {
        if (Array.isArray(payload)) return payload;
        const exists = prev.some((m) => m._id === payload._id);
        if (exists) return prev;
        return [...prev, payload];
      });
    };

    socket.on("receive-message", handler);

    return () => {
      socket.off("receive-message", handler);
    };
  }, [dynamicActiveConversation?.conversationId]);

  const sendMessage = async () => {
    if (!messageInput.trim() && !uplodedUrl.url.trim()) return;

    let recieverId =
      (dynamicActiveConversation?.participantsAre?.[0] === user?.id
        ? dynamicActiveConversation?.participantsAre?.[1]
        : dynamicActiveConversation?.participantsAre?.[0]) || "";

    setSendMsgLoading(true);

    const payload: any = {
      conversationId: dynamicActiveConversation.conversationId,
      senderType: "PROVIDER",
      receiverId: recieverId,
    };

    if (uplodedUrl.url.trim()) {
      payload.attachments = [uplodedUrl.url];
      payload.messageType = uplodedUrl.type;
    }
    if (messageInput.trim()) {
      payload.content = messageInput;
    }

    try {
      const res = await authFetch("/api/chat/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();
      const { message } = await res.json();

      socketRef.current?.emit("send-message", message);
      setUploadedUrl({ url: "", type: "" });
    } catch (err) {
      console.log("Failed To post message", err);
    } finally {
      setSendMsgLoading(false);
    }

    setMessageInput("");
  };

  const [activeConversationId, setActiveConversationId] = useState(conversations[0].id);
  const [messagesByConversation, setMessagesByConversation] = useState<Record<string, Message[]>>({
    "1": initialMessages,
  });
  const messages: Message[] = messagesByConversation[activeConversationId] || [];

  const activeConversation = conversations.find((c) => c.id === activeConversationId)!;

  const formatedTime = (recivedTime: string) => {
    const date = new Date(recivedTime);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
  };

  const fetchMessages = async (id: string) => {
    setChatLoading(true);
    try {
      const res = await authFetch(`/api/chat/message/${id}`);
      await authFetch(`/api/chat/read`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId: id }),
      });

      if (!res.ok) throw new Error();
      const data = await res.json();
      setDynamicMessages(data.messages || []);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    } finally {
      setChatLoading(false);
    }
  };

  const handleClickedConversation = async (recievdId: string) => {
    router.push(`/client/dashboard/message?conversationId=${recievdId}`);
    const found = dynamicConversation.find((c: any) => c.conversationId === recievdId);

    if (found) {
      setDynamicActiveConversation(found);

      let tempCount = 0;
      setDynamicConversation((prev = []) =>
        prev.map((item) => {
          if (item.conversationId === found.conversationId) {
            tempCount = item.unreadCount || 0;
            return { ...item, unreadCount: 0 };
          }
          return item;
        })
      );

      setFileteredDynamicConversation((prev = []) =>
        prev.map((item) => {
          if (item.conversationId === found.conversationId) {
            return { ...item, unreadCount: 0 };
          }
          return item;
        })
      );

      setTotalUnreadMessagesCount((prev) => prev - tempCount);
      await fetchMessages(recievdId);
    }

    if (isMobile) setIsMobileChatOpen(true);
  };

  const handleDeleteConversation = async (conversationId: string) => {
    try {
      setDeletingId(conversationId);
      const res = await authFetch(`/api/chat/conversation/${conversationId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      await loadData();
    } catch (err) {
      console.log("Delete failed", err);
    } finally {
      setDeletingId(null);
    }
  };

  const toggleFavorite = (conversationId: string) => {
    setFavorites((prev) =>
      prev.includes(conversationId)
        ? prev.filter((id) => id !== conversationId)
        : [...prev, conversationId]
    );
  };

  // Attachment Upload
  const [uploading, setUploading] = useState(false);
  const [uplodedUrl, setUploadedUrl] = useState({ url: "", type: "" });

  const MAX_SIZE = 20 * 1024 * 1024;
  const ALLOWED_TYPES = ["image/", "application/pdf"];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_SIZE) {
      alert("File size must be less than 20MB");
      return;
    }
    if (!ALLOWED_TYPES.some((type) => file.type.startsWith(type))) {
      alert("Only images and PDF files are allowed");
      return;
    }

    const fileCategory = file.type.startsWith("image/") ? "image" : "file";

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error();

      const data = await res.json();
      setUploadedUrl({ url: data.url, type: fileCategory.toUpperCase() });
    } catch (err) {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = (url: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = "";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (resLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-2 -mt-2">
      <div className="grid lg:grid-cols-[340px_1fr] gap-3">
        {/* LEFT SIDEBAR */}
        {(!isMobile || !isMobileChatOpen) && (
          <Card className="rounded-2xl p-4 max-h-[86vh] bg-white overflow-hidden flex flex-col">
            <div className="h-5 flex justify-between items-center mb-3">
              <h3 className="font-semibold text-2xl">
                Messages{" "}
                <span className="ml-1 text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
                  {totalUnreadMessagesCount}
                </span>
              </h3>
              <button
                onClick={() => setEditMode((prev) => !prev)}
                className="flex items-center gap-1 text-sm text-blue-600 hover:opacity-70"
              >
                <Pencil className="h-4 w-4" />
                {editMode ? "Done" : "Edit"}
              </button>
            </div>

            <div className="relative ">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search"
                className="pl-9 rounded-full bg-gray-100"
                onChange={(e) => {
                  setFileteredDynamicConversation(() =>
                    dynamicConversation.filter((eachItem: any) =>
                      eachItem.participant?.name
                        ?.trim()
                        .toLowerCase()
                        .includes(e.target.value.trim().toLowerCase())
                    )
                  );
                }}
              />
            </div>

            {(filteredDynamicConversation || []).length !== 0 ? (
              <div className="space-y-2 flex-1 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {[...filteredDynamicConversation]
                  .sort((a, b) => {
                    const aFav = favorites.includes(a.conversationId);
                    const bFav = favorites.includes(b.conversationId);
                    return aFav === bFav ? 0 : aFav ? -1 : 1;
                  })
                  .map((c) => (
                    <div
                      key={c.conversationId}
                      onClick={() => !editMode && handleClickedConversation(c.conversationId)}
                      className={clsx(
                        "flex items-center gap-3 p-3 rounded-xl transition",
                        editMode ? "cursor-default" : "cursor-pointer",
                        dynamicActiveConversation?.conversationId === c.conversationId
                          ? "bg-blue-50"
                          : "hover:bg-gray-100"
                      )}
                    >
                      <div className="relative">
                        <img
                          src={c.participant?.image || "https://i.pravatar.cc/100?img=12"}
                          className="h-10 w-10 rounded-full"
                        />
                        {c?.online && (
                          <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <p className="text-sm font-semibold truncate">{c.participant?.name}</p>
                          {c?.lastMessageAt && (
                            <span className="text-xs text-gray-400">{formatedTime(c.lastMessageAt)}</span>
                          )}
                        </div>

                        <div className="flex justify-between items-center mt-1">
                          <p className="text-xs text-gray-500 truncate max-w-[180px]">{c.lastMessage}</p>
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

                      {editMode && (
                        <div className="flex items-center gap-3 ml-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteConversation(c.conversationId);
                            }}
                            className="text-red-500 hover:scale-110 transition"
                          >
                            {deletingId === c.conversationId ? (
                              <span className="text-xs">...</span>
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">No Conversations Started yet</p>
              </div>
            )}
          </Card>
        )}

        {/* CHAT PANEL - FIXED SCROLLING */}
        {(!isMobile || isMobileChatOpen) && (
          <>
            {!resLoading && !failed && dynamicActiveConversation ? (
              <Card className="rounded-2xl flex flex-col h-[85vh] bg-white border-0 py-0 shadow-none overflow-hidden">
                {/* Fixed Header */}
                <div className="flex-shrink-0 bg-[#f9f9f9] px-6 py-3 border-b flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {isMobile && (
                      <button
                        onClick={() => setIsMobileChatOpen(false)}
                        className="text-blue-600 text-lg mr-2"
                      >
                        <MoveLeft className="h-4 w-4 font-extrabold" strokeWidth={3} />
                      </button>
                    )}
                    <img
                      src={
                        dynamicActiveConversation.participant?.image ||
                        "https://i.pravatar.cc/100?img=32"
                      }
                      className="h-9 w-9 rounded-full"
                    />
                    <div>
                      <p className="font-medium">{dynamicActiveConversation.participant?.name}</p>
                    </div>
                  </div>

                  <Button
                    onClick={() => setOpen(true)}
                    className="text-xs bg-red-500 text-white px-3 h-[25px] w-[70px] rounded-full"
                  >
                    Report
                  </Button>
                </div>

                {/* Scrollable Messages Area - ONLY THIS SCROLLS */}
                <div className="flex-1 px-6 py-4 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden space-y-4 overscroll-contain">
                  {!chatLaoding && dynamicMessages.length > 0 ? (
                    dynamicMessages.map((msg: Message, index) => {
                      const currentDate = new Date(msg.createdAt).toDateString();
                      const prevDate =
                        index > 0
                          ? new Date(dynamicMessages[index - 1].createdAt).toDateString()
                          : null;
                      const showDateDivider = currentDate !== prevDate;

                      return (
                        <div key={msg._id}>
                          {showDateDivider && (
                            <div className="flex justify-center my-4">
                              <span className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                                {formatDateLabel(msg.createdAt)}
                              </span>
                            </div>
                          )}

                          <div
                            className={clsx(
                              "flex",
                              msg.senderId === user?.id ? "justify-end" : "justify-start"
                            )}
                          >
                            <div className="max-w-[70%]">
                              <div
                                className={clsx(
                                  "rounded-2xl px-4 py-3 text-sm",
                                  msg.senderId === user?.id ? "bg-blue-100" : "bg-gray-100"
                                )}
                              >
                                {msg.attachments?.length > 0 && (
                                  <div onClick={() => handleDownload(msg.attachments[0])}>
                                    {msg.messageType?.toLowerCase() === "image" ? (
                                      <img
                                        src={msg.attachments[0]}
                                        className="rounded-lg max-h-40"
                                      />
                                    ) : (
                                      <div className="flex items-center gap-2 text-xs w-[40px] h-[40px] bg-white p-2 rounded-lg">
                                        <FileText className="h-10 w-10" />
                                      </div>
                                    )}
                                  </div>
                                )}
                                {msg.content}
                              </div>

                              <div className="flex items-center justify-end gap-1 text-[10px] text-gray-400 mt-1">
                                {msg.senderId === user?.id && (
                                  <div>
                                    {msg.isRead ? (
                                      <CheckCheck color="blue" size={16} />
                                    ) : (
                                      <Check size={16} />
                                    )}
                                  </div>
                                )}
                                {formatedTime(msg.createdAt)}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : chatLaoding ? (
                    <div className="text-center py-10">
                      <p className="text-gray-500">Loading messages...</p>
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-gray-500">No Messages Yet</p>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Fixed Input Area */}
                <div className="flex-shrink-0 px-6  bg-white">
                  <div className="mb-2">
                    {uploading && <span>Uploading...</span>}
                    {uplodedUrl.url && (
                      <div>
                        {uplodedUrl.url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                          <img
                            src={uplodedUrl.url}
                            alt="preview"
                            className="w-[60px] h-[60px] object-cover rounded"
                          />
                        ) : (
                          <a href={uplodedUrl.url} target="_blank" className="text-blue-600">
                            View Uploaded File
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 bg-gray-50 rounded-full px-4 py-2">
                    <Paperclip
                      className="h-5 w-5 text-blue-600 cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    />
                    <input
                      ref={fileInputRef}
                      type="file"
                      hidden
                      accept="image/*,application/pdf"
                      onChange={handleFileChange}
                      disabled={uploading}
                    />
                    <Input
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") sendMessage();
                      }}
                      placeholder="Message"
                      className="border-0 bg-transparent shadow-none placeholder:text-gray-400 focus-visible:ring-0"
                    />
                    <button onClick={sendMessage} disabled={sendMsgLoading}>
                      <Send className="h-5 w-5 text-blue-600 cursor-pointer" />
                    </button>
                  </div>
                </div>
              </Card>
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-500">Click on any conversation to start chatting</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Report Modal */}
      {open && (
        <ReportContentModal
          open={open}
          onClose={() => setOpen(false)}
          reportedTo={`${
            dynamicActiveConversation?.participantsAre?.[0] === user?.id
              ? dynamicActiveConversation?.participantsAre?.[1]
              : dynamicActiveConversation?.participantsAre?.[0]
          }`}
        />
      )}
    </div>
  );
}