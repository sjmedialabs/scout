"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Download,
  FileText,
  CreditCard,
  CircleDollarSign,
  AlertTriangle,
} from "lucide-react";
import {
  mockSubscriptionStats,
} from "@/lib/mock-data";
const mockBillingInvoices = [
  {
    id: "INV-001",
    date: "2025-11-15",
    amount: 199,
    plan: "Pro Plan",
    status: "paid",
  },
  {
    id: "INV-002",
    date: "2025-11-28",
    amount: 499,
    plan: "Enterprise Plan",
    status: "pending",
  },
  {
    id: "INV-003",
    date: "2025-12-01",
    amount: 99,
    plan: "Basic Plan",
    status: "failed",
  },
];

export default function BillingPage() {
  const [invoices, setInvoices] = useState(mockBillingInvoices || []);
  const [billingStats, setBillingStats] = useState(mockSubscriptionStats);

  /*
  ------------------------------------------------------
  OPTIONAL: Fetch Billing + Invoices from backend API
  ------------------------------------------------------
  useEffect(() => {
    async function loadBilling() {
      const res = await fetch("/api/admin/billing");
      const data = await res.json();

      setInvoices(data.invoices);
      setBillingStats(data.billingStats);
    }
    loadBilling();
  }, []);
  */

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-700">Paid</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-700">Failed</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const downloadPDF = (id: string) => {
    console.log("Downloading invoice PDF:", id);
  };

  const downloadCSV = (id: string) => {
    console.log("Downloading invoice CSV:", id);
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Billing & Invoices</h1>
        <p className="text-gray-500">Manage payments, subscriptions, and invoice history.</p>
      </div>

      {/* Billing Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Monthly Recurring Revenue */}
        <BillingCard
          title="Monthly Recurring Revenue"
          value={`$${billingStats.monthlyRecurring.toLocaleString()}`}
          icon={<CircleDollarSign className="w-7 h-7 text-green-600" />}
          gradient="from-green-100 to-green-200"
        />

        {/* Total Subscribers */}
        {/* <BillingCard
          title="Active Subscribers"
          value={billingStats.activeSubscribers}
          icon={<CreditCard className="w-7 h-7 text-blue-600" />}
          gradient="from-blue-100 to-blue-200"
        /> */}

        {/* Pending Payments */}
        {/* <BillingCard
          title="Pending Payments"
          value={billingStats.pendingPayments || 0}
          icon={<AlertTriangle className="w-7 h-7 text-yellow-600" />}
          gradient="from-yellow-100 to-yellow-200"
        /> */}
      </div>

      {/* Invoice List */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border">
        <h2 className="text-xl font-semibold mb-6">Invoice History</h2>

        <div className="space-y-4">
          {invoices.map((invoice) => (
            <div
              key={invoice.id}
              className="p-5 border rounded-xl flex flex-col md:flex-row justify-between hover:shadow-lg transition"
            >
              {/* Left Info */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>

                <div>
                  <h3 className="font-semibold text-lg">{invoice.plan}</h3>
                  <p className="text-gray-500 text-sm">
                    Invoice ID: <span className="font-medium">{invoice.id}</span>
                  </p>

                  <p className="text-gray-600 text-sm mt-1">
                    Date: {invoice.date}
                  </p>

                  <p className="text-gray-900 font-semibold mt-2">
                    ${invoice.amount.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Right */}
              <div className="flex flex-col items-end gap-3 mt-4 md:mt-0">
                {/* Status */}
                {getStatusBadge(invoice.status)}

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                    onClick={() => downloadPDF(invoice.id)}
                  >
                    <Download className="w-4 h-4" />
                    PDF
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => downloadCSV(invoice.id)}
                  >
                    <Download className="w-4 h-4" />
                    CSV
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {invoices.length === 0 && (
          <p className="text-gray-500 mt-6 text-center">No invoices available.</p>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   REUSABLE BILLING CARD COMPONENT
--------------------------------------------------------- */
function BillingCard({ title, value, icon, gradient }: any) {
  return (
    <div
      className="group bg-white rounded-2xl p-6 border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      <div className="flex items-center justify-between pb-3">
        <h3 className="text-sm text-gray-600">{title}</h3>
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${gradient} group-hover:scale-110 transition-transform`}
        >
          {icon}
        </div>
      </div>

      <div className="text-2xl font-bold text-gray-800">{value}</div>
    </div>
  );
}
