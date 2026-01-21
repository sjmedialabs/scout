"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download } from "lucide-react"



const billingContact = {
  name: "Jhon Williams",
  email: "Jhon@gmail.com",
  altEmail: "billing@gmail.com",
  phone: "+91-1234567890",
  avatar:
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200",
}

const planDetails = {
  name: "Professional",
  price: "$9.99 / month",
}

const cardDetails = {
  brand: "VISA",
  last4: "5673",
}

const billingHistory = [
  { invoice: "#1023", date: "May 15, 2022", status: "Paid", amount: "$9.99" },
  { invoice: "#1016", date: "Nov 28, 2020", status: "Paid", amount: "$9.99" },
  { invoice: "#1022", date: "Nov 13, 2018", status: "Paid", amount: "$9.99" },
  { invoice: "#1019", date: "Mar 9, 2013", status: "Paid", amount: "$9.99" },
  { invoice: "#1018", date: "Nov 2, 2011", status: "Paid", amount: "$49.99" },
  { invoice: "#1020", date: "Dec 20, 2009", status: "Paid", amount: "$9.99" },
  { invoice: "#1017", date: "Nov 22, 2008", status: "Paid", amount: "$9.99" },
  { invoice: "#1021", date: "Apr 16, 2007", status: "Cancelled", amount: "$19.99" },
]



export default function BillingPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-orangeButton my-custom-class">
          Billing & Subscription
        </h1>
        <p className="text-lg text-gray-500">
          Manage your subscription and billing details
        </p>
      </div>

      {/* Top Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Contact Details */}
        <Card className="rounded-xl bg-white py-2">
          <CardHeader className="flex mt-0 flex-row items-start justify-between">
            <div>
              <CardTitle className="text-orangeButton h-6 my-custom-class text-lg">
                Contact Details:
              </CardTitle>
              <p className="text-xs text-gray-500">
                Who should we contact if necessary?
              </p>
            </div>
            <Button className="rounded-xl" variant="outline" size="sm">
              Update/Edit
            </Button>
          </CardHeader>

          <CardContent className="flex gap-4 items-center">
            <img
              src={billingContact.avatar}
              alt="avatar"
              className="h-20 w-20 rounded-full object-cover"
            />
            <div className="space-y-1">
              <p className="font-semibold">{billingContact.name}</p>
              <p className="text-sm text-gray-500">
                Email: {billingContact.email}
              </p>
              <p className="text-sm text-gray-500">
                Alt : {billingContact.altEmail}
              </p>
              <p className="text-sm text-gray-500">
                {billingContact.phone}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Plan + Card */}
        <div className="space-y-2">
          <Card className="rounded-2xl bg-white py-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="h-10">
                <CardTitle className="text-orangeButton h-6 my-custom-class text-lg">
                  Plan: {planDetails.name}
                </CardTitle>
                <p className="text-xs text-gray-500 leading-tight">
                  Take your portfolio to next level with more features
                </p>
              </div>
              <Button className="rounded-xl" variant="outline" size="sm">
                Upgrade Plan
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-blue-600 font-medium">
                {planDetails.price}
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl bg-white py-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Card Details</CardTitle>
              <Button className="rounded-xl" variant="outline" size="sm">
                Update
              </Button>
            </CardHeader>
            <CardContent className="flex items-center gap-3">
              <div className="border text-blueButton rounded-xl px-2 py-1 font-semibold">
                {cardDetails.brand}
              </div>
              <div>
                <p className="text-sm">
                  {cardDetails.brand} ending in
                </p>
                <p className="text-sm text-gray-500">
                  ********{cardDetails.last4}
                </p>
              </div>
              <span className="ml-auto text-blue-600 text-xs">
                Primary Card
              </span>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Billing History */}
      <div>
        <h2 className="text-xl font-semibold text-orangeButton my-custom-class">
          Billing History
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Summery on the payment history for the subscription plan on the Applications
        </p>

        <Card className="rounded-2xl overflow-hidden">
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="text-left px-4 py-3">Invoice</th>
                  <th className="text-left px-4 py-3">Billing Date</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Amount</th>
                  <th className="px-4 py-3 text-right">Plan</th>
                </tr>
              </thead>
              <tbody>
                {billingHistory.map((row) => (
                  <tr
                    key={row.invoice}
                    className="border-t last:border-b"
                  >
                    <td className="px-4 py-3">
                      Invoice {row.invoice}
                    </td>
                    <td className="px-4 py-3">{row.date}</td>
                    <td className="px-4 py-3">
                      <Badge
                        className={
                          row.status === "Paid"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                        }
                      >
                        ● {row.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">{row.amount}</td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4 text-gray-500" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
