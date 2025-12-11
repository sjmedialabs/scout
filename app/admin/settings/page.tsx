"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Settings,
  Shield,
  Bell,
  Moon,
  Sun,
  Database,
  Wrench,
} from "lucide-react";

export default function SettingsPage() {
  const [autoApprove, setAutoApprove] = useState(false);
  const [reviewModeration, setReviewModeration] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [emailSender, setEmailSender] = useState("no-reply@platform.com");
  const [retentionDays, setRetentionDays] = useState(365);
  const [theme, setTheme] = useState("system");

  /*
  --------------------------------------------------
  OPTIONAL: Load from backend API
  --------------------------------------------------
  useEffect(() => {
    async function loadSettings() {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();

      setAutoApprove(data.autoApprove);
      setReviewModeration(data.reviewModeration);
      setMaintenanceMode(data.maintenanceMode);
      setEmailSender(data.emailSender);
      setRetentionDays(data.retentionDays);
      setTheme(data.theme);
    }
    loadSettings();
  }, []);
  */

  const saveSettings = () => {
    console.log("Saving settings:", {
      autoApprove,
      reviewModeration,
      maintenanceMode,
      emailSender,
      retentionDays,
      theme,
    });

    // Future API:
    // await fetch("/api/admin/settings", { method: "POST", body: JSON.stringify(settings) });
  };

  return (
    <div className="space-y-10">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Platform Settings</h1>
        <p className="text-gray-500">Manage system-wide preferences and configurations.</p>
      </div>

      {/* Platform Controls */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-600" />
          General Platform Controls
        </h2>

        {/* Auto Approval */}
        <SettingRow
          title="Auto-Approve New Providers"
          description="Automatically approve provider profiles without admin review."
        >
          <Switch checked={autoApprove} onCheckedChange={setAutoApprove} />
        </SettingRow>

        {/* Review Moderation */}
        <SettingRow
          title="Review Moderation"
          description="Require admin approval for user-submitted reviews."
        >
          <Switch
            checked={reviewModeration}
            onCheckedChange={setReviewModeration}
          />
        </SettingRow>

        {/* Maintenance Mode */}
        <SettingRow
          title="Maintenance Mode"
          description="Temporarily disable platform access for all users."
        >
          <Switch
            checked={maintenanceMode}
            onCheckedChange={setMaintenanceMode}
          />
        </SettingRow>
      </div>

      {/* Email Configuration */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Bell className="w-5 h-5 text-purple-600" />
          Email & Notification Settings
        </h2>

        <SettingRow
          title="Email Sender Address"
          description="Outgoing emails will appear from this address."
        >
          <Input
            className="w-64"
            value={emailSender}
            onChange={(e) => setEmailSender(e.target.value)}
          />
        </SettingRow>

        <SettingRow
          title="Enable Email Alerts"
          description="Allows system notifications to be delivered by email."
        >
          <Switch />
        </SettingRow>
      </div>

      {/* Security & Retention */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Shield className="w-5 h-5 text-green-600" />
          Security & Data Retention
        </h2>

        <SettingRow
          title="Data Retention Period"
          description="Number of days user data is stored before auto-deletion."
        >
          <Input
            type="number"
            className="w-24"
            value={retentionDays}
            onChange={(e) => setRetentionDays(Number(e.target.value))}
          />
        </SettingRow>

        <SettingRow
          title="Automatic Backup"
          description="Enable weekly automatic platform backups."
        >
          <Switch />
        </SettingRow>
      </div>

      {/* UI Customization */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Wrench className="w-5 h-5 text-orange-600" />
          UI Customization
        </h2>

        <SettingRow
          title="Theme Mode"
          description="Choose how the admin panel appearance should behave."
        >
          <select
            className="border rounded-xl px-3 py-2"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          >
            <option value="light">Light Mode ☀️</option>
            <option value="dark">Dark Mode 🌙</option>
            <option value="system">System Default 🖥️</option>
          </select>
        </SettingRow>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={saveSettings}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700"
        >
          Save Settings
        </Button>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   Setting Row Component
--------------------------------------------------------- */
function SettingRow({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-4 border-b last:border-none">
      <div>
        <h3 className="font-medium text-gray-800">{title}</h3>
        <p className="text-gray-500 text-sm">{description}</p>
      </div>
      <div>{children}</div>
    </div>
  );
}
