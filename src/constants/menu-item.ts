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
} from "lucide-react";

export interface MenuItem {
  icon: React.ComponentType<any>;
  label: string;
  href: string;
  visible: string[];
  group?: string;
  permission?: string;
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
    permission: "students:view",
  },
  {
    icon: Clipboard,
    label: "Enrollments",
    href: "/admin/enrollments",
    visible: ["admin"],
    group: "Student Management",
    permission: "enrollments:view",
  },
  {
    icon: GraduationCap,
    label: "Teachers",
    href: "/admin/teachers",
    visible: ["admin"],
    group: "Staff Management",
    permission: "teachers:view",
  },
  {
    icon: Users,
    label: "Admins",
    href: "/admin/admins",
    visible: ["admin"],
    group: "Staff Management",
    permission: "admins:view",
  },
  {
    icon: Users,
    label: "Roles and Permissions",
    href: "/admin/roles",
    visible: ["admin"],
    group: "Staff Management",
    permission: "roles-permissions:view",
  },
  {
    icon: Clipboard,
    label: "Batches",
    href: "/admin/batches",
    visible: ["admin"],
    group: "Academics",
    permission: "batches:view",
  },
  {
    icon: Book,
    label: "Courses",
    href: "/admin/courses",
    visible: ["admin"],
    group: "Academics",
    permission: "courses:view",
  },
  {
    icon: FileText,
    label: "Classrooms",
    href: "/admin/classrooms",
    visible: ["admin"],
    group: "Academics",
    permission: "classrooms:view",
  },
  {
    icon: Calendar,
    label: "Time Slots",
    href: "/admin/timeslots",
    visible: ["admin"],
    group: "Academics",
    permission: "timeslots:view",
  },
  {
    icon: CalendarDays,
    label: "Timetables",
    href: "/admin/timetables",
    visible: ["admin"],
    group: "Academics",
    permission: "timetables:view",
  },
  {
    icon: Banknote,
    label: "Payments",
    href: "/admin/payments",
    visible: ["admin"],
    group: "Finance",
    permission: "payments:view",
  },
  {
    icon: Bell,
    label: "Announcements",
    href: "/admin/announcements",
    visible: ["admin"],
    group: "Communication",
    permission: "announcements:view",
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
    label: "My Courses",
    href: "/student/enrolled-courses",
    visible: ["student"],
    group: "Academics",
  },
  {
    icon: Clipboard,
    label: "Assignments",
    href: "/student/assignments",
    visible: ["student"],
    group: "Academics",
  },
  {
    icon: FileText,
    label: "Payments",
    href: "/student/payments",
    visible: ["student"],
    group: "Finance",
  },
];
