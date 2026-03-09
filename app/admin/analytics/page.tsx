"use client";

import { useState, useEffect } from "react";
import { AnalyticsDashboard } from "@/components/admin/analytics-dashboard";
import {
  mockAdminStats,
  mockSubscriptionStats,
  mockProvider,
  mockReportedContent,
} from "@/lib/mock-data";
import {
  LineChart,
  Line,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import { User } from "@/lib/types";
import { AlertTriangle, FileText, Users } from "lucide-react";
import {
  type Provider,
  type Requirement,
  type Notification,
  type Project,
  type Review,
  Proposal,
} from "@/lib/types";
import { authFetch } from "@/lib/auth-fetch";
import { FaAws } from "react-icons/fa";

export default function AnalyticsPage() {

  const [filter, setFilter] = useState("all")
  const [dateRange, setDateRange] = useState({ start: null, end: null })
  
  const [stats, setStats] = useState(mockAdminStats);
  // const [subscriptionStats, setSubscriptionStats] = useState(
  //   mockSubscriptionStats,
  // );
  // const [topProviders, setTopProviders] = useState([mockProvider]);
  const [topProviders, setTopProviders] = useState<Provider[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([])
  const [lifetimeRevenue, setLifetimeRevenue] = useState(0)
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [reportedContent, setReportedContent] = useState(mockReportedContent);
  const [requirements, setRequirements] = useState([]);
  const [userDistribution, setUserDistribution] = useState({
    clientsCount: 0,
    clientsCountPercentage: 0,
    agenciesCount: 0,
    agenciesCountPercentage: 0,
    pendingApproval:0,
    monthlyRevenue:0,
    percentageIncrease:0,
    lifetimeGrowth:0
  });
  const[topCardsStats,setTopCardsStats]=useState({
    totalUsers:0,
    usersAddedInthisMonth:0,
    totalClients:0,
    clientsAddedInThisMonth:0,
    totalAgencies:0,
    agenciesAddedInThisMonth:0,
    monthlyRevenue:0,
    totalMonthlyRevenue:0
  })
  const [topPerformingAgencies, setTopPerformingAgencies] = useState<
    Provider[]
  >([]);

      const [subscriptionStats, setSubscriptionStats] = useState<{
      planId: string;
      planName: string;
      count: number;
      percentage: number;
    }[]>([]);

    const [freeTrialStats, setFreeTrialStats] = useState<{
      count: number;
      percentage: number;
    }>({ count: 0, percentage: 0 });

   const[bottomCardStats,setBottomCardStats]=useState({
         monthlyRecurringRevenue:0,
         activeSubscriberCount:0,
         avgRevenuePereUser:0,
         platformGrowthPercentage:0
   })

  // const[dynamicSubscriptionStats,setDynamicSubscriptionStats]=useState({

  // })

  const[reports,setReports]=useState([]);

 const getFilterRange = () => {
  const now = new Date()

  if (filter === "today") {
    const start = new Date()
    start.setHours(0,0,0,0)
    return { start, end: new Date() }
  }

  if (filter === "week") {
    const start = new Date()
    start.setDate(now.getDate() - 7)
    return { start, end: new Date() }
  }

  if (filter === "month") {
    return {
      start: new Date(now.getFullYear(), now.getMonth(), 1),
      end: new Date()
    }
  }

  if (filter === "year") {
    return {
      start: new Date(now.getFullYear(), 0, 1),
      end: new Date()
    }
  }

  if (filter === "custom") {
    return dateRange
  }

  return null
}

const filterByDate = (data:any[]) => {
  const range = getFilterRange()

  if (!range) return data

  return data.filter((item:any)=>{
    const date = new Date(item.createdAt)

    return date >= new Date(range.start) &&
           date <= new Date(range.end)
  })
}


  useEffect(() => {
    async function fetchDashboardData() {
      // To decrease server load, use a single aggregated endpoint
      // or Promise.all to fetch concurrently.
      try {
        setIsLoading(true);
        const [
          //statsRes, subRes,
          usersRes,
          requirementsRes,
          providersRes,
          paymentRes,
          subscriptionRes,
          reportsRes
        ] = await Promise.all([
          //   authFetch("/api/admin/stats"),
          //   authFetch("/api/admin/subscriptions"),
          authFetch("/api/users"),
          authFetch("/api/requirements"),
          authFetch("/api/providers"),
          authFetch("/api/payment"),
          authFetch("/api/subscription"),
          authFetch("/api/reported-content")
        ]);
        const usersData = await usersRes.json();
        const filteredUsers = filterByDate(usersData.users)
        // let totalUsers = usersData.users.length;
        let totalUsers = filteredUsers.length;
        // let clientCounts = usersData.users.filter(
        let clientCounts = filteredUsers.filter(
          (eachItem) => eachItem.role === "client",
        ).length;
        let clientsCountPercentage =
          totalUsers > 0 ? Math.round((clientCounts / totalUsers) * 100) : 0;
        let agenciesCount = totalUsers - clientCounts;
        let agencyCountPercentage =
          totalUsers > 0 ? Math.round((agenciesCount / totalUsers) * 100) : 0;


      

        // console.log("Total users count::::", totalUsers);
        // console.log("clients counts::::", clientCounts);
        // console.log("clients counts percentage::::", clientsCountPercentage);
        // console.log("Agencies count:::::", agenciesCount);
        // console.log("Agencies percentage:::::", agencyCountPercentage);

        // setUserDistribution({
        //   clientsCount: clientCounts,
        //   clientsCountPercentage: clientsCountPercentage,
        //   agenciesCount: agenciesCount,
        //   agenciesCountPercentage: agencyCountPercentage,
        //   pendingApproval:usersData.users.filter((eachItem)=>!eachItem.isVerified).length
        // });

        setUsers(usersData.users.filter((item)=>item.role!=="admin"));

        const requirementsData = await requirementsRes.json();
        console.log("Fetched requirements data:", requirementsData);

        const providersData = await providersRes.json();
        const providers = providersData.providers || [];

        // const topThreePerformers = providers
        //   .filter((p) => typeof p.rating === "number") // optional safety
        //   .sort((a, b) => b.rating - a.rating) // highest rating first
        //   .slice(0, 3);

        setRequirements(requirementsData.requirements);

        //Monthly payment

        const paymentsData = await paymentRes.json();
          const payments = paymentsData.data;

          const filteredPayments = filterByDate(payments)

          const range = getFilterRange()

            // let filteredPayments = payments

            // if (range) {
            //   filteredPayments = payments.filter((p:any) => {
            //     const date = new Date(p.createdAt)

            //     return date >= new Date(range.start) &&
            //           date <= new Date(range.end)
            //   })
            // }

          const successfulPayments = filteredPayments.filter(
            (p: any) => p.status === "success"
          );

          // provider revenue map
           const providerRevenueMap: Record<string, number> = {};

            // group payments by userId (agency user)
            successfulPayments.forEach((payment: any) => {
              const userId = payment.userId?.toString();

              if (!providerRevenueMap[userId]) {
                providerRevenueMap[userId] = 0;
              }

              providerRevenueMap[userId] += payment.amount;
            });

            // attach revenue to providers using provider.userId
            const providersWithRevenue = providers.map((provider: any) => ({
              ...provider,
              revenue: providerRevenueMap[provider.userId?.toString()] || 0
            }));

            // top 3 agencies
            const topThreePerformers = providersWithRevenue
              // .filter((p) => typeof p.rating === "number")
              .sort((a, b) => b.rating - a.rating)
              .slice(0, 3);

            setTopPerformingAgencies(topThreePerformers);

          // Lifetime revenue
          const totalRevenue = successfulPayments.reduce(
            (sum: number, p: any) => sum + p.amount,
            0
          );

          setLifetimeRevenue(totalRevenue);

          // // Monthly chart data
          // const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

          // const revenueMap: Record<number, number> = {};

          // successfulPayments.forEach((p:any)=>{
          //   const date = new Date(p.createdAt);
          //   const month = date.getMonth();

          //   revenueMap[month] = (revenueMap[month] || 0) + p.amount;
          // });

          // const chartData = months.map((m, index)=>({
          //   name: m,
          //   revenue: revenueMap[index] || 0
          // }));

          // setRevenueData(chartData);

          let chartData: any[] = []

          // TODAY → hourly chart
          if (filter === "today") {

            const hourlyMap: Record<number, number> = {}

            successfulPayments.forEach((p:any)=>{
              const hour = new Date(p.createdAt).getHours()
              hourlyMap[hour] = (hourlyMap[hour] || 0) + p.amount
            })

            chartData = Array.from({ length: 24 }, (_, i) => ({
              name: `${i}:00`,
              revenue: hourlyMap[i] || 0
            }))

          }

          // WEEK / MONTH / CUSTOM → daily chart
          else if (filter === "week" || filter === "month" || filter === "custom") {

            const dailyMap: Record<string, number> = {}

            successfulPayments.forEach((p:any)=>{
              const day = new Date(p.createdAt).toLocaleDateString()

              dailyMap[day] = (dailyMap[day] || 0) + p.amount
            })

            chartData = Object.entries(dailyMap).map(([day,value])=>({
              name: day,
              revenue: value
            }))

          }

          // YEAR / ALL → monthly chart
          else {

            const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
            const revenueMap: Record<number, number> = {}

            successfulPayments.forEach((p:any)=>{
              const month = new Date(p.createdAt).getMonth()
              revenueMap[month] = (revenueMap[month] || 0) + p.amount
            })

            chartData = months.map((m,index)=>({
              name: m,
              revenue: revenueMap[index] || 0
            }))

          }

          setRevenueData(chartData)

        const now = new Date()

        const currentYear = now.getFullYear()
        const currentMonth = now.getMonth()

        const lastMonthDate = new Date(currentYear, currentMonth - 1)
        const lastMonth = lastMonthDate.getMonth()
        const lastMonthYear = lastMonthDate.getFullYear()

        const currentMonthRevenue = getMonthlyRevenue(
          successfulPayments,
          currentYear,
          currentMonth
        )

        // FIRST payment date
          const firstPaymentDate = new Date(
            Math.min(...successfulPayments.map((p:any) => new Date(p.createdAt)))
          )

          // revenue from first month
          const firstMonthRevenue = getMonthlyRevenue(
            successfulPayments,
            firstPaymentDate.getFullYear(),
            firstPaymentDate.getMonth()
          )

          // lifetime revenue
          const lifetimeRevenueValue = successfulPayments.reduce(
            (sum:number, p:any) => sum + p.amount,
            0
          )

          // growth from start till now
          let lifetimeGrowth = 0

          if (firstMonthRevenue > 0) {
            lifetimeGrowth =
              ((lifetimeRevenueValue - firstMonthRevenue) / firstMonthRevenue) * 100
          }

        const lastMonthRevenue = getMonthlyRevenue(
          successfulPayments,
          lastMonthYear,
          lastMonth
        )

        let revenueIncreasePercentage = 0

        if (lastMonthRevenue > 0) {
          revenueIncreasePercentage =
            ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
        }

         setUserDistribution({
          clientsCount: clientCounts,
          clientsCountPercentage: clientsCountPercentage,
          agenciesCount: agenciesCount,
          agenciesCountPercentage: agencyCountPercentage,
          pendingApproval:providersData.providers.filter((eachItem)=>!eachItem.isVerified).length,
          monthlyRevenue:currentMonthRevenue,
          percentageIncrease:Number(revenueIncreasePercentage.toFixed(2)),
          lifetimeGrowth:Number(lifetimeGrowth.toFixed(2))
        });

        const subscriptionData=await subscriptionRes.json();
        // const users = usersData.users;                 // all users
        const plans = subscriptionData;  // available plans

        const users = filteredUsers;
        const totalRegisteredUsers = filteredUsers.length;

        // const totalRegisteredUsers = users.length;

        const planCountMap: Record<string, number> = {};
        let freeTrialCount = 0;

        // Step 1: classify users
        // users.forEach((user: any) => {
        filteredUsers.forEach((user: any) => {
          if (user.subscriptionPlanId) {
            const planId = user.subscriptionPlanId._id;
            planCountMap[planId] = (planCountMap[planId] || 0) + 1;
          } else {
            freeTrialCount++;
          }
        });

        console.log("Plans Map is :::",planCountMap)

          // Step 2: build subscription plan stats
          const planStats = plans.map((plan: any) => {
            const count = planCountMap[plan._id] || 0;
            const percentage =
              totalRegisteredUsers > 0
                ? Number(((count / totalRegisteredUsers) * 100).toFixed(2))
                : 0;

            return {
              planId: plan._id,
              planName: plan.title,
              count,
              percentage,
            };
          });

          // Step 3: free trial stats
          const freeTrialPercentage =
            totalRegisteredUsers > 0
              ? Number(((freeTrialCount / totalRegisteredUsers) * 100).toFixed(2))
              : 0;
          
          
          setSubscriptionStats(()=>[...planStats,{
            planId:"123",
            planName:"Free trail",
            count:freeTrialCount,
            percentage:freeTrialPercentage
          }]);
          setFreeTrialStats({
            count: freeTrialCount,
            percentage: freeTrialPercentage,
          });

          //botom cards stats
          const currentMRR = getCurrentMonthMRR(filteredPayments)
          const arpu = getARPU(filteredPayments)
          const growth=lastMonthRevenue>0?((currentMonthRevenue- lastMonthRevenue) /lastMonthRevenue) * 100:0
          setBottomCardStats({
            monthlyRecurringRevenue:currentMRR,
            activeSubscriberCount:usersData.users.filter((eachItem)=>eachItem. subscriptionPlanId).length,
            avgRevenuePereUser:arpu,
            platformGrowthPercentage:growth.toFixed(2)
          })

          const reportsData=await reportsRes.json();
          setReports(reportsData.reports.filter((item)=>item.status==="pending"));

         
          // const usersAddedThisMonth = usersData.users.filter((user) => {
          const usersAddedThisMonth = filteredUsers.filter((user) => {
        const createdDate = new Date(user.createdAt);

        return (
          createdDate.getMonth() === currentMonth &&
          createdDate.getFullYear() === currentYear
        );
      }).length;

      let clientsAddedThisMonth = filteredUsers.filter((eachItem) => {
        if (eachItem.role !== "client") return false;

        const createdDate = new Date(eachItem.createdAt);

        return (
          createdDate.getMonth() === currentMonth &&
          createdDate.getFullYear() === currentYear
        );
      }).length;

      let agenciesAddedThisMonth = filteredUsers.filter((eachItem) => {
        if (eachItem.role !== "agency") return false;

        const createdDate = new Date(eachItem.createdAt);

        return (
          createdDate.getMonth() === currentMonth &&
          createdDate.getFullYear() === currentYear
        );
      }).length;

        
        setTopCardsStats({
          totalUsers:totalUsers,
          usersAddedInthisMonth:usersAddedThisMonth,
          totalClients:clientCounts,
          clientsAddedInThisMonth:clientsAddedThisMonth,
          totalAgencies:agenciesCount,
          agenciesAddedInThisMonth:agenciesAddedThisMonth,
          monthlyRevenue:0,
          totalMonthlyRevenue:0
        })


      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        // setIsLoading(false);
      }
    }

    fetchDashboardData();
  }, [filter, dateRange]);

  const pendingReports = reportedContent.filter(
    (r) => r.status === "pending",
  ).length;
  const pendingUsers = users.filter((u) => !u.isVerified).length;
  const activeRequirements = requirements.filter(
    (r) => r.status === "Allocated",
  ).length;
console.log("Subscription statst:::::::",subscriptionStats);
  function getMonthlyRevenue(payments: any[], year: number, month: number) {
  return payments
    .filter((p) => {
      const date = new Date(p.createdAt)
      return (
        date.getFullYear() === year &&
        date.getMonth() === month // 0-based
      )
    })
    .reduce((sum, p) => sum + p.amount, 0)
}

const percentage = userDistribution.percentageIncrease || 0

let helperText = "0%"
let helperColor = "text-orangeButton"

if (percentage > 0) {
  helperText = `${percentage}% growth`
  helperColor = "text-green-600"
} else if (percentage < 0) {
  helperText = `${Math.abs(percentage)}% drop`
  helperColor = "text-red-600"
}
const getCurrentMonthMRR = (payments) => {
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  return payments
    .filter(p => 
      p.status === "success" &&
      new Date(p.createdAt).getMonth() === currentMonth &&
      new Date(p.createdAt).getFullYear() === currentYear
    )
    .reduce((sum, p) => sum + p.amount, 0)
}
const getARPU = (payments) => {
  const successfulPayments = payments.filter(p => p.status === "success")

  const totalRevenue = successfulPayments.reduce(
    (sum, p) => sum + p.amount,
    0
  )

  const uniqueUsers = new Set(
    successfulPayments.map(p => p.userId)
  )

  return uniqueUsers.size === 0
    ? 0
    : Math.round( totalRevenue / uniqueUsers.size)
}




  return (
    <div className="space-y-6 -mt-5">
      <div className="border-b pb-2 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold -mb-1 text-orangeButton">
            Analytics Overview
          </h1>
          <p className="text-gray-500 text-md">
            Key platform insights and performance metrics
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm bg-white shadow-sm"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>
      </div>

      {filter === "custom" && (
  <div className="flex items-center gap-2 mt-3">
    <input
      type="date"
      value={dateRange.start ? dateRange.start.toISOString().split("T")[0] : ""}
      onChange={(e) =>
        setDateRange((prev) => ({
          ...prev,
          start: new Date(e.target.value),
        }))
      }
      className="border rounded-md px-3 py-2 text-sm"
    />

    <span className="text-gray-500">to</span>

    <input
      type="date"
      value={dateRange.end ? dateRange.end.toISOString().split("T")[0] : ""}
      onChange={(e) =>
        setDateRange((prev) => ({
          ...prev,
          end: new Date(e.target.value),
        }))
      }
      className="border rounded-md px-3 py-2 text-sm"
    />
  </div>
)}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <DashboardCard
          title="Total Users"
          icon={<Users className="h-4 w-4 text-orangeButton" />}
          gradient="from-blue-100 to-blue-200"
          value={topCardsStats.totalUsers}
          helper={`+${topCardsStats.usersAddedInthisMonth}  added this month`}
        />

        {/* Active Projects */}
        <DashboardCard
          title="Clients"
          icon={<FileText className="h-4 w-4 text-orangeButton" />}
          gradient="from-green-100 to-green-200"
          value={topCardsStats.totalClients}
          helper={`+${topCardsStats.clientsAddedInThisMonth} added this month`}
        />

        {/* Pending Reports */}
        <DashboardCard
          title="Agencies"
          icon={<AlertTriangle className="h-4 w-4 text-orangeButton" />}
          gradient="from-orange-100 to-orange-200"
          value={topCardsStats.totalAgencies}
          helper={`+${topCardsStats.agenciesAddedInThisMonth} added this month`}
        />

        {/* Monthly Revenue */}
        <DashboardCard
          title="Monthly Revenue"
          icon={
            <img
              src="/images/revenue-icon.png"
              className="h-4 w-4 text-orangeButton"
            />
          }
          gradient="from-purple-100 to-purple-200"
          value={`$${userDistribution.monthlyRevenue.toLocaleString()}`}
          helper={<span className={helperColor}>{helperText}</span>}
        />
      </div>
      <AnalyticsDashboard
        stats={userDistribution}
        subscriptionStats={subscriptionStats}
        topProviders={topPerformingAgencies}
        revenueData={revenueData}
        lifetimeRevenue={lifetimeRevenue}

      />
      {/* Stats Grid */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        <DashboardCard
          title="Average Revenue Per User"
          icon={<Users className="h-4 w-4 text-orangeButton" />}
          gradient="from-blue-100 to-blue-200"
          value={`${bottomCardStats.monthlyRecurringRevenue.toLocaleString() || 0}`}
          helper={`From ${bottomCardStats.activeSubscriberCount || 0} active subscriptions`}
        />

       
        <DashboardCard
          title="Average Revenue Per User"
          icon={<FileText className="h-4 w-4 text-orangeButton" />}
          gradient="from-green-100 to-green-200"
          value={bottomCardStats.avgRevenuePereUser}
          helper={`Per paying user`}
        />

        
        <DashboardCard
          title="Platform Growth"
          icon={<AlertTriangle className="h-4 w-4 text-orangeButton" />}
          gradient="from-orange-100 to-orange-200"
          value={`${bottomCardStats.platformGrowthPercentage}%`}
          helper="Month over month growth"
        />
      </div> */}
    </div>
  );
}
/* ---------------------------------------------------------
   REUSABLE DASHBOARD CARD COMPONENT
--------------------------------------------------------- */
function DashboardCard({ title, value, icon, helper, gradient }: any) {
  return (
    <div
      className="group bg-white rounded-2xl p-6 pb-3 -mt-3 shadow-md
                 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      <div className="flex items-center justify-between pb-0 -mt-4">
        <div>
          <h3 className="text-sm font-semibold">{title}</h3>
        </div>
        <div
          className={`p-2 rounded-full flex items-center justify-center
          bg-[#EEF7FE] group-hover:scale-110 transition-transform`}
        >
          {icon}
        </div>
      </div>

      <div className="text-2xl font-bold text-slate-800">{value}</div>
      <p className="text-xs text-green-500 font-extralight mt-1">{helper}</p>
    </div>
  );
}
