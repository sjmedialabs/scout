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

const NotificationsPage=()=>{
    return(
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold mb-2">Notifications</h1>
                <p className="text-muted-foreground">Configure your notification settings</p>
            </div>
            <Card>
                <CardContent className="pt-6">
                <div className="text-center py-8">
                    <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Notification settings coming soon</p>
                </div>
                </CardContent>
            </Card>
        </div>
    )
}
export default NotificationsPage;