import type {
  Student,
  Course,
  AttendanceLog,
  AttendanceSession,
  DashboardStats,
  SystemHealth,
} from "@/types";

const departments = [
  "Computer Science",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Business Administration",
  "Mathematics",
  "Physics",
];
const sections = ["A", "B", "C", "D"];
const batches = ["2021", "2022", "2023", "2024"];
const firstNames = ["Aiden", "Sara", "Liam", "Maya", "Noah", "Zara", "Omar", "Hana", "Ali", "Ivy", "Ethan", "Layla", "Yusuf", "Mira", "Daniyal", "Aisha", "Bilal", "Nadia", "Hassan", "Reem"];
const lastNames = ["Khan", "Ahmed", "Patel", "Rahman", "Hussain", "Siddiqui", "Malik", "Iqbal", "Sharma", "Raza", "Chen", "Garcia", "Smith", "Johnson", "Lopez"];

function pick<T>(arr: T[], i: number): T {
  return arr[i % arr.length];
}

export function generateStudents(count: number): Student[] {
  return Array.from({ length: count }, (_, i) => {
    const first = pick(firstNames, i * 3);
    const last = pick(lastNames, i * 7);
    const batch = pick(batches, i);
    return {
      id: `stu-${1000 + i}`,
      studentId: `${batch}-CS-${String(i + 1).padStart(4, "0")}`,
      name: `${first} ${last}`,
      email: `${first.toLowerCase()}.${last.toLowerCase()}@university.edu`,
      department: pick(departments, i),
      batch,
      section: pick(sections, i),
      faceProfiles: (i % 6),
      status: i % 11 === 0 ? "pending" : i % 17 === 0 ? "inactive" : "active",
      enrolledAt: new Date(2023, i % 12, (i % 27) + 1).toISOString(),
    };
  });
}

export const mockStudents: Student[] = generateStudents(48);

export const mockCourses: Course[] = [
  { id: "c1", code: "CS-301", title: "Data Structures & Algorithms", department: "Computer Science", section: "A", teacherId: "t1", teacherName: "Dr. Sarah Ahmed", studentsEnrolled: 142, schedule: "Mon, Wed 10:00-11:30" },
  { id: "c2", code: "CS-401", title: "Machine Learning", department: "Computer Science", section: "B", teacherId: "t2", teacherName: "Prof. Hassan Khan", studentsEnrolled: 98, schedule: "Tue, Thu 14:00-15:30" },
  { id: "c3", code: "EE-302", title: "Digital Signal Processing", department: "Electrical Engineering", section: "A", teacherId: "t3", teacherName: "Dr. Omar Malik", studentsEnrolled: 76, schedule: "Mon, Fri 09:00-10:30" },
  { id: "c4", code: "ME-201", title: "Thermodynamics", department: "Mechanical Engineering", section: "C", teacherId: "t4", teacherName: "Prof. Layla Rahman", studentsEnrolled: 110, schedule: "Wed, Fri 11:00-12:30" },
  { id: "c5", code: "BA-501", title: "Strategic Management", department: "Business Administration", section: "A", teacherId: "t5", teacherName: "Dr. Yusuf Iqbal", studentsEnrolled: 124, schedule: "Tue, Thu 09:00-10:30" },
  { id: "c6", code: "MATH-203", title: "Linear Algebra", department: "Mathematics", section: "B", teacherId: "t6", teacherName: "Prof. Mira Siddiqui", studentsEnrolled: 88, schedule: "Mon, Wed 13:00-14:30" },
];

export const mockAttendanceLogs: AttendanceLog[] = mockStudents.slice(0, 12).map((s, i) => ({
  id: `log-${i}`,
  studentId: s.studentId,
  studentName: s.name,
  courseCode: pick(mockCourses, i).code,
  timestamp: new Date(Date.now() - i * 1000 * 60 * 7).toISOString(),
  status: i % 9 === 0 ? "late" : i % 13 === 0 ? "absent" : "present",
  confidence: 0.88 + ((i * 7) % 12) / 100,
}));

export const mockSessions: AttendanceSession[] = [
  { id: "s1", courseCode: "CS-301", courseTitle: "Data Structures & Algorithms", teacherName: "Dr. Sarah Ahmed", startedAt: new Date(Date.now() - 1000 * 60 * 22).toISOString(), presentCount: 118, totalStudents: 142, status: "active" },
  { id: "s2", courseCode: "CS-401", courseTitle: "Machine Learning", teacherName: "Prof. Hassan Khan", startedAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(), presentCount: 71, totalStudents: 98, status: "active" },
];

export const mockStats: DashboardStats = {
  totalStudents: 25420,
  activeCourses: 184,
  todayPresent: 18960,
  todayAbsent: 2140,
  activeSessions: 42,
  faceProfiles: 123800,
};

export const mockHealth: SystemHealth = {
  api: "online",
  database: "healthy",
  vectorDb: "healthy",
  queue: "normal",
};

// 14-day attendance trend
export const mockAttendanceTrend = Array.from({ length: 14 }, (_, i) => {
  const day = new Date();
  day.setDate(day.getDate() - (13 - i));
  const base = 17500 + Math.sin(i / 2) * 800 + i * 60;
  return {
    date: day.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    present: Math.round(base),
    absent: Math.round(25420 - base - 4500 + Math.cos(i) * 200),
  };
});

// Department breakdown for reports
export const mockDepartmentReport = departments.map((d, i) => ({
  department: d,
  present: 2400 + i * 320,
  absent: 240 + i * 35,
}));
