import {
  Home,
  User,
  Users,
  Book,
  Clipboard,
  FileText,
  CheckSquare,
  Calendar,
  Bell,
  GraduationCap,
  CalendarDays,
} from "lucide-react";

export interface MenuItem {
  icon: React.ComponentType<any>;
  label: string;
  href: string;
  visible: string[];
  group?: string;
}

export const menuItems: MenuItem[] = [
  // Admin-specific
  {
    icon: Home,
    label: "Dashboard",
    href: "/admin",
    visible: ["admin"],
    group: "Main",
  },
  {
    icon: Users,
    label: "Students",
    href: "/admin/students",
    visible: ["admin"],
    group: "User Management",
  },
  {
    icon: GraduationCap,
    label: "Teachers",
    href: "/admin/teachers",
    visible: ["admin"],
    group: "User Management",
  },
  {
    icon: Users,
    label: "Admins",
    href: "/admin/admins",
    visible: ["admin"],
    group: "User Management",
  },
  {
    icon: Users,
    label: "Roles and Permissions",
    href: "/admin/roles",
    visible: ["admin"],
    group: "User Management",
  },
  {
    icon: Book,
    label: "Courses",
    href: "/admin/courses",
    visible: ["admin"],
    group: "Academic",
  },
  {
    icon: Clipboard,
    label: "Batches",
    href: "/admin/batches",
    visible: ["admin"],
    group: "Academic",
  },
  {
    icon: FileText,
    label: "Classrooms",
    href: "/admin/classrooms",
    visible: ["admin"],
    group: "Academic",
  },
  {
    icon: Calendar,
    label: "Time Slots",
    href: "/admin/timeslots",
    visible: ["admin"],
    group: "Academic",
  },
  {
    icon: CalendarDays,
    label: "Timetables",
    href: "/admin/timetables",
    visible: ["admin"],
    group: "Academic",
  },
  {
    icon: Clipboard,
    label: "Enrollments",
    href: "/admin/enrollments",
    visible: ["admin"],
    group: "Academic",
  },
  {
    icon: CheckSquare,
    label: "Attendance",
    href: "/student/attendance",
    visible: ["admin"],
    group: "Academic",
  },
  {
    icon: Clipboard,
    label: "Assignments",
    href: "/admin/assignments",
    visible: ["admin"],
    group: "Academic",
  },
  {
    icon: FileText,
    label: "Submissions",
    href: "/admin/submissions",
    visible: ["admin"],
    group: "Academic",
  },
  {
    icon: Calendar,
    label: "Exams",
    href: "/admin/exams",
    visible: ["admin"],
    group: "Academic",
  },
  {
    icon: CheckSquare,
    label: "Exam Results",
    href: "/admin/exam-results",
    visible: ["admin"],
    group: "Academic",
  },
  {
    icon: FileText,
    label: "Payments",
    href: "/admin/payments",
    visible: ["admin"],
    group: "Finance",
  },
  {
    icon: Bell,
    label: "Announcements",
    href: "/admin/announcements",
    visible: ["admin"],
    group: "Communication",
  },

  // Teacher-specific
  { icon: Home, label: "Dashboard", href: "/teacher", visible: ["teacher"] },
  {
    icon: Clipboard,
    label: "Batches",
    href: "/teacher/batches",
    visible: ["teacher"],
    group: "Academic",
  },
  {
    icon: Clipboard,
    label: "Timetables",
    href: "/teacher/timetables",
    visible: ["teacher"],
    group: "Academic",
  },
  {
    icon: CheckSquare,
    label: "Attendance",
    href: "/student/attendance",
    visible: ["teacher"],
    group: "Academic",
  },
  {
    icon: Clipboard,
    label: "Assignments",
    href: "/teacher/assignments",
    visible: ["teacher"],
    group: "Academic",
  },
  {
    icon: FileText,
    label: "Submissions",
    href: "/teacher/submissions",
    visible: ["teacher"],
    group: "Academic",
  },
  {
    icon: Calendar,
    label: "Exams",
    href: "/teacher/exams",
    visible: ["teacher"],
    group: "Academic",
  },
  {
    icon: CheckSquare,
    label: "Exam Results",
    href: "/teacher/exam-results",
    visible: ["teacher"],
    group: "Academic",
  },
  {
    icon: Bell,
    label: "Announcements",
    href: "/teacher/announcements",
    visible: ["teacher"],
    group: "Academic",
  },

  // Student-specific
  { icon: Home, label: "Dashboard", href: "/student", visible: ["student"] },
  {
    icon: Book,
    label: "Enrolled Courses",
    href: "/student/courses",
    visible: ["student"],
  },
  {
    icon: CheckSquare,
    label: "Attendance",
    href: "/student/attendance",
    visible: ["student"],
  },
  {
    icon: Clipboard,
    label: "Assignments",
    href: "/student/assignments",
    visible: ["student"],
  },
  {
    icon: FileText,
    label: "Submissions",
    href: "/student/submissions",
    visible: ["student"],
  },
  {
    icon: Calendar,
    label: "Exams",
    href: "/student/exams",
    visible: ["student"],
  },
  {
    icon: CheckSquare,
    label: "Exam Results",
    href: "/student/exam-results",
    visible: ["student"],
  },
  {
    icon: FileText,
    label: "Payments",
    href: "/student/payments",
    visible: ["student"],
  },
  {
    icon: Bell,
    label: "Announcements",
    href: "/student/announcements",
    visible: ["student"],
  },
];
