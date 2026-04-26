import { useEffect, useState } from "react";
import { Users, BookOpen, UserCheck, UserX, Activity, ScanFace, TrendingUp, Server, Database, Boxes, ListOrdered } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { api } from "@/services/api";
import type { DashboardStats, SystemHealth, AttendanceLog } from "@/types";
import { useAuth } from "@/contexts/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [trend, setTrend] = useState<Array<{ date: string; present: number; absent: number }>>([]);
  const [logs, setLogs] = useState<AttendanceLog[]>([]);

  useEffect(() => {
    Promise.all([api.getStats(), api.getHealth(), api.getAttendanceTrend(), api.getRecentLogs()]).then(
      ([s, h, t, l]) => {
        setStats(s); setHealth(h); setTrend(t); setLogs(l);
      }
    );
  }, []);

  const cards = stats
    ? [
        { label: "Total Students", value: stats.totalStudents, icon: Users, iconColor: "primary" as const, trend: { value: 4.2 } },
        { label: "Active Courses", value: stats.activeCourses, icon: BookOpen, iconColor: "info" as const, trend: { value: 2.1 } },
        { label: "Today Present", value: stats.todayPresent, icon: UserCheck, iconColor: "success" as const, trend: { value: 6.4 } },
        { label: "Today Absent", value: stats.todayAbsent, icon: UserX, iconColor: "destructive" as const, trend: { value: -3.1 } },
        { label: "Active Sessions", value: stats.activeSessions, icon: Activity, iconColor: "warning" as const, trend: { value: 12 } },
        { label: "Face Profiles", value: stats.faceProfiles, icon: ScanFace, iconColor: "primary" as const, trend: { value: 8.7 } },
      ]
    : [];

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${user?.name?.split(" ")[0] || "User"}`}
        description="Here's what's happening across your institution today."
        icon={TrendingUp}
      />

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {cards.map((c) => (
          <StatCard key={c.label} {...c} />
        ))}
      </div>

      {/* Chart + health */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Attendance Trend</CardTitle>
            <CardDescription>Daily present vs absent — last 14 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trend} margin={{ top: 10, right: 10, left: -16, bottom: 0 }}>
                  <defs>
                    <linearGradient id="g-present" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--success))" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="hsl(var(--success))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="g-absent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--destructive))" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Area type="monotone" dataKey="present" stroke="hsl(var(--success))" strokeWidth={2} fill="url(#g-present)" />
                  <Area type="monotone" dataKey="absent" stroke="hsl(var(--destructive))" strokeWidth={2} fill="url(#g-absent)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>Real-time infrastructure status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {health && [
              { label: "API", icon: Server, status: health.api },
              { label: "Database", icon: Database, status: health.database },
              { label: "Vector DB", icon: Boxes, status: health.vectorDb },
              { label: "Queue", icon: ListOrdered, status: health.queue },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between rounded-lg border bg-muted/30 p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-card border">
                    <row.icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <span className="text-sm font-medium">{row.label}</span>
                </div>
                <StatusBadge status={row.status} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent logs */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Attendance Logs</CardTitle>
          <CardDescription>Latest face-matched attendance events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Confidence</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">{log.studentName}</TableCell>
                    <TableCell className="text-muted-foreground">{log.studentId}</TableCell>
                    <TableCell>{log.courseCode}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-xs font-semibold">
                        {(log.confidence * 100).toFixed(1)}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={log.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
