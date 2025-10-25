"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, UserCog, BookOpen, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import { useGetAdminDashboard } from "@/hooks/useDashboard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const AdminPage = () => {
  // @ts-ignore
  const { data, isLoading }: { data: any } = useGetAdminDashboard();
  const resData = data?.data;

  if (isLoading) return <div>Loading...</div>;

  const statCards = [
    {
      title: "Total Students",
      value: resData?.stats.totalStudents ?? 0,
      icon: <Users className="w-5 h-5 text-blue-600" />,
      color: "bg-blue-100",
    },
    {
      title: "Total Teachers",
      value: resData?.stats.totalTeachers ?? 0,
      icon: <BookOpen className="w-5 h-5 text-green-600" />,
      color: "bg-green-100",
    },
    {
      title: "Total Admins",
      value: resData?.stats.totalAdmins ?? 0,
      icon: <UserCog className="w-5 h-5 text-orange-600" />,
      color: "bg-orange-100",
    },
    {
      title: "Monthly Revenue",
      value: resData?.stats.monthlyRevenue
        ? `${resData.stats.monthlyRevenue.toLocaleString()} MMK`
        : "0 MMK",
      icon: <DollarSign className="w-5 h-5 text-purple-600" />,
      color: "bg-purple-100",
    },
  ];

  const enrollmentData = resData?.charts.dailyEnrollments ?? [];
  const yearlyEnrollment = resData?.charts.yearlyEnrollments ?? [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
      </div>

      {/* Statistic Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="p-4 shadow-sm border">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <h4 className="text-xl font-semibold">{stat.value}</h4>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Enrollments by Day</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={enrollmentData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Yearly Enrollment Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={yearlyEnrollment}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#16a34a"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPage;
