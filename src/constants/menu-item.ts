import {
  Home,
  Users,
  Book,
  Clipboard,
  FileText,
  CheckSquare,
  Calendar,
  Bell,
  GraduationCap,
  CalendarDays,
  Banknote,
  User,
  MessageCircle,
  Megaphone,
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
    group: "Student Management",
  },
  {
    icon: Clipboard,
    label: "Enrollments",
    href: "/admin/enrollments",
    visible: ["admin"],
    group: "Student Management",
  },
  {
    icon: GraduationCap,
    label: "Teachers",
    href: "/admin/teachers",
    visible: ["admin"],
    group: "Staff Management",
  },
  {
    icon: Users,
    label: "Admins",
    href: "/admin/admins",
    visible: ["admin"],
    group: "Staff Management",
  },
  {
    icon: Users,
    label: "Roles and Permissions",
    href: "/admin/roles",
    visible: ["admin"],
    group: "Staff Management",
  },
  {
    icon: Clipboard,
    label: "Batches",
    href: "/admin/batches",
    visible: ["admin"],
    group: "Academics",
  },
  {
    icon: Book,
    label: "Courses",
    href: "/admin/courses",
    visible: ["admin"],
    group: "Academics",
  },
  {
    icon: FileText,
    label: "Classrooms",
    href: "/admin/classrooms",
    visible: ["admin"],
    group: "Academics",
  },
  {
    icon: Calendar,
    label: "Time Slots",
    href: "/admin/timeslots",
    visible: ["admin"],
    group: "Academics",
  },
  {
    icon: CalendarDays,
    label: "Timetables",
    href: "/admin/timetables",
    visible: ["admin"],
    group: "Academics",
  },
  {
    icon: Banknote,
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
  {
    icon: Home,
    label: "Dashboard",
    href: "/teacher",
    visible: ["teacher"],
    group: "Main",
  },
  {
    icon: Clipboard,
    label: "Classes",
    href: "/teacher/classes",
    visible: ["teacher"],
    group: "My Classes",
  },
  {
    icon: Calendar,
    label: "Timetables",
    href: "/teacher/timetables",
    visible: ["teacher"],
    group: "My Classes",
  },
  {
    icon: CheckSquare,
    label: "Attendances",
    href: "/teacher/attendances",
    visible: ["teacher"],
    group: "My Classes",
  },
  {
    icon: User,
    label: "Students",
    href: "/teacher/students",
    visible: ["teacher"],
    group: "Students & Performance",
  },
  {
    icon: Clipboard,
    label: "Assignments",
    href: "/teacher/assignments",
    visible: ["teacher"],
    group: "Students & Performance",
  },
  {
    icon: FileText,
    label: "Submissions",
    href: "/teacher/submissions",
    visible: ["teacher"],
    group: "Students & Performance",
  },
  {
    icon: Calendar,
    label: "Exams",
    href: "/teacher/exams",
    visible: ["teacher"],
    group: "Students & Performance",
  },
  {
    icon: CheckSquare,
    label: "Exam Results",
    href: "/teacher/exam-results",
    visible: ["teacher"],
    group: "Students & Performance",
  },

  // Student-specific
  {
    icon: Home,
    label: "Dashboard",
    href: "/student",
    visible: ["student"],
    group: "Main",
  },
  {
    icon: Calendar,
    label: "Timetables",
    href: "/student/timetables",
    visible: ["student"],
    group: "Main",
  },
  {
    icon: Book,
    label: "Enrolled Courses",
    href: "/student/enrolled-courses",
    visible: ["student"],
    group: "Courses & Assignments",
  },
  {
    icon: Clipboard,
    label: "Assignments",
    href: "/student/assignments",
    visible: ["student"],
    group: "Courses & Assignments",
  },
  {
    icon: FileText,
    label: "Submissions",
    href: "/student/submissions",
    visible: ["student"],
    group: "Courses & Assignments",
  },
  {
    icon: CheckSquare,
    label: "Attendances",
    href: "/student/attendances",
    visible: ["student"],
    group: "Exams & Attendances",
  },
  {
    icon: Calendar,
    label: "Exams",
    href: "/student/exams",
    visible: ["student"],
    group: "Exams & Attendances",
  },
  {
    icon: CheckSquare,
    label: "Exam Results",
    href: "/student/exam-results",
    visible: ["student"],
    group: "Exams & Attendances",
  },
  {
    icon: FileText,
    label: "Payments",
    href: "/student/payments",
    visible: ["student"],
    group: "Finance",
  },
];
