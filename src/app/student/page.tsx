"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, ClipboardList, Bell, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { useGetStudentDashboard } from "@/hooks/useDashboard";

const StudentPage = () => {
  // @ts-ignore
  const { data, isLoading }: { data: any } = useGetStudentDashboard();
  const resData = data?.data;
  if (isLoading) return <div>Loading...</div>;

  // Stat Cards
  const statCards = [
    {
      title: "Enrolled Courses",
      value: resData?.stats.enrolledCourses ?? 0,
      icon: <BookOpen className="w-5 h-5 text-blue-600" />,
      color: "bg-blue-100",
    },
    {
      title: "Pending Assignments",
      value: resData?.stats.pendingAssignments ?? 0,
      icon: <ClipboardList className="w-5 h-5 text-orange-600" />,
      color: "bg-orange-100",
    },
  ];

  const announcements = resData?.announcements ?? [];
  const recentAssignments = resData?.recentAssignments ?? [];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
        <Button>View All Courses</Button>
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
                  <h2 className="text-2xl font-semibold">{stat.value}</h2>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Announcements */}
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-blue-600" />
              Announcements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {announcements.map((a: any, idx: any) => (
              <div
                key={idx}
                className="p-4 border rounded-lg hover:bg-muted/50 transition"
              >
                <h3 className="font-medium text-base">{a.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{a.body}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(a.publishAt).toLocaleString()}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Assignments */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Assignments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentAssignments.map((a: any, idx: any) => (
              <div
                key={idx}
                className="flex justify-between items-center p-3 border rounded-lg hover:bg-muted/50 transition"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{a.title}</p>
                    <p className="text-xs text-muted-foreground">
                      Due: {a.dueDate}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentPage;
