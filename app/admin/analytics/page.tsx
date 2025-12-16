"use client";

import { useState, useEffect } from "react";
import { AnalyticsDashboard } from "@/components/admin/analytics-dashboard";
import {
  mockAdminStats,
  mockSubscriptionStats,
  mockProvider,
} from "@/lib/mock-data";

export default function AnalyticsPage() {
  const [stats, setStats] = useState(mockAdminStats);
  const [subscriptionStats, setSubscriptionStats] = useState(mockSubscriptionStats);
  const [topProviders, setTopProviders] = useState([mockProvider]);

  /*
  ----------------------------------------
  OPTIONAL: Fetch real analytics from API
  ----------------------------------------
  useEffect(() => {
    async function loadAnalytics() {
      const res = await fetch("/api/admin/analytics");
      const data = await res.json();

      setStats(data.stats);
      setSubscriptionStats(data.subscriptionStats);
      setTopProviders(data.topProviders);
    }
    loadAnalytics();
  }, []);
  */

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Analytics Overview</h1>
      <p className="text-gray-500">Key platform insights and performance metrics</p>

      <AnalyticsDashboard
        stats={stats}
        subscriptionStats={subscriptionStats}
        topProviders={topProviders}
      />
    </div>
  );
}
