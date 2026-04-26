// API-ready service layer. Currently returns mock data with simulated latency.
// Swap implementations with fetch() calls when backend is ready.

import {
  mockStudents,
  mockCourses,
  mockAttendanceLogs,
  mockSessions,
  mockStats,
  mockHealth,
  mockAttendanceTrend,
  mockDepartmentReport,
} from "@/data/mockData";
import type {
  Student,
  Course,
  AttendanceLog,
  AttendanceSession,
  DashboardStats,
  SystemHealth,
} from "@/types";

const delay = (ms = 350) => new Promise((r) => setTimeout(r, ms));

export const api = {
  // Dashboard
  async getStats(): Promise<DashboardStats> {
    await delay(200);
    return mockStats;
  },
  async getHealth(): Promise<SystemHealth> {
    await delay(150);
    return mockHealth;
  },
  async getAttendanceTrend() {
    await delay(200);
    return mockAttendanceTrend;
  },
  async getRecentLogs(): Promise<AttendanceLog[]> {
    await delay(200);
    return mockAttendanceLogs;
  },

  // Students
  async getStudents(): Promise<Student[]> {
    await delay(300);
    return mockStudents;
  },
  async getStudent(id: string): Promise<Student | undefined> {
    await delay(200);
    return mockStudents.find((s) => s.id === id);
  },
  async createStudent(input: Omit<Student, "id" | "enrolledAt" | "faceProfiles" | "status">): Promise<Student> {
    await delay(400);
    return {
      ...input,
      id: `stu-${Date.now()}`,
      enrolledAt: new Date().toISOString(),
      faceProfiles: 0,
      status: "pending",
    };
  },

  // Courses
  async getCourses(): Promise<Course[]> {
    await delay(300);
    return mockCourses;
  },

  // Attendance
  async getActiveSessions(): Promise<AttendanceSession[]> {
    await delay(200);
    return mockSessions;
  },
  async startSession(courseCode: string): Promise<AttendanceSession> {
    await delay(500);
    const course = mockCourses.find((c) => c.code === courseCode)!;
    return {
      id: `s-${Date.now()}`,
      courseCode: course.code,
      courseTitle: course.title,
      teacherName: course.teacherName,
      startedAt: new Date().toISOString(),
      presentCount: 0,
      totalStudents: course.studentsEnrolled,
      status: "active",
    };
  },
  async matchFace(): Promise<{ student: Student; confidence: number }> {
    await delay(800);
    const idx = Math.floor(Math.random() * mockStudents.length);
    return { student: mockStudents[idx], confidence: 0.92 + Math.random() * 0.07 };
  },

  // Reports
  async getDepartmentReport() {
    await delay(250);
    return mockDepartmentReport;
  },
};
