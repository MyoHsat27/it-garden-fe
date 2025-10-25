"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Users,
  FileText,
  Calendar,
  ClipboardList,
  TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";
import { useGetTeacherDashboard } from "@/hooks/useDashboard";
import { Submission } from "@/types/api/submission";

const TeacherPage = () => {
  //@ts-ignore
  const { data, isLoading }: { data: any } = useGetTeacherDashboard();
  const resData = data?.data;

  if (isLoading) return <div>Loading...</div>;

  const statCards = [
    {
      title: "Assigned Classes",
      value: resData?.stats?.assignedClasses ?? 0,
      icon: <BookOpen className="w-5 h-5 text-blue-600" />,
      color: "bg-blue-100",
    },
    {
      title: "Total Students",
      value: resData?.stats?.totalStudents ?? 0,
      icon: <Users className="w-5 h-5 text-green-600" />,
      color: "bg-green-100",
    },
    {
      title: "Pending Assignments",
      value: resData?.stats?.pendingAssignments ?? 0,
      icon: <FileText className="w-5 h-5 text-orange-600" />,
      color: "bg-orange-100",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Teacher Dashboard</h1>
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
                  <h2 className="text-xl font-semibold">{stat.value}</h2>
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
        {/* Recent Submissions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Submissions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {resData?.recentSubmissions.map((s: Submission, idx: any) => {
              return (
                <div key={idx} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{s.content}</p>
                    <p className="text-xs text-muted-foreground">
                      {s.assignment.title}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Submitted at: {s.submittedAt}
                  </span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeacherPage;
