// Centralized type definitions for the Enterprise AI Attendance System

export type UserRole = "admin" | "teacher";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Student {
  id: string;
  studentId: string;
  name: string;
  email: string;
  department: string;
  batch: string;
  section: string;
  faceProfiles: number;
  status: "active" | "inactive" | "pending";
  avatar?: string;
  enrolledAt: string;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  department: string;
  section: string;
  teacherId: string;
  teacherName: string;
  studentsEnrolled: number;
  schedule: string;
}

export interface AttendanceLog {
  id: string;
  studentId: string;
  studentName: string;
  courseCode: string;
  timestamp: string;
  status: "present" | "late" | "absent";
  confidence: number;
  avatar?: string;
}

export interface AttendanceSession {
  id: string;
  courseCode: string;
  courseTitle: string;
  teacherName: string;
  startedAt: string;
  endedAt?: string;
  presentCount: number;
  totalStudents: number;
  status: "active" | "closed";
}

export interface SystemHealth {
  api: "online" | "degraded" | "offline";
  database: "healthy" | "degraded" | "down";
  vectorDb: "healthy" | "degraded" | "down";
  queue: "normal" | "backlogged" | "stalled";
}

export interface DashboardStats {
  totalStudents: number;
  activeCourses: number;
  todayPresent: number;
  todayAbsent: number;
  activeSessions: number;
  faceProfiles: number;
}
