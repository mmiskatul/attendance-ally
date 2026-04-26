import { useEffect, useState } from "react";
import { ClipboardCheck, Play, Square, Camera, Upload, User, Sparkles, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { CameraCapture } from "@/components/shared/CameraCapture";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { api } from "@/services/api";
import type { Course, AttendanceLog, Student } from "@/types";
import { toast } from "sonner";

export default function Attendance() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selected, setSelected] = useState("");
  const [active, setActive] = useState<{ course: Course; startedAt: string; presentCount: number } | null>(null);
  const [logs, setLogs] = useState<AttendanceLog[]>([]);
  const [matching, setMatching] = useState(false);
  const [lastMatch, setLastMatch] = useState<{ student: Student; confidence: number } | null>(null);

  useEffect(() => { api.getCourses().then(setCourses); }, []);

  const start = () => {
    if (!selected) { toast.error("Select a course first"); return; }
    const course = courses.find((c) => c.id === selected)!;
    setActive({ course, startedAt: new Date().toISOString(), presentCount: 0 });
    setLogs([]); setLastMatch(null);
    toast.success(`Session started for ${course.code}`);
  };

  const close = () => {
    if (!active) return;
    toast.success(`Session closed · ${active.presentCount} students marked`);
    setActive(null); setLastMatch(null);
  };

  const capture = async () => {
    if (!active) return;
    setMatching(true);
    const m = await api.matchFace();
    setLastMatch(m);
    const log: AttendanceLog = {
      id: `log-${Date.now()}`,
      studentId: m.student.studentId,
      studentName: m.student.name,
      courseCode: active.course.code,
      timestamp: new Date().toISOString(),
      status: m.confidence > 0.95 ? "present" : "late",
      confidence: m.confidence,
    };
    setLogs((prev) => [log, ...prev]);
    setActive((a) => a ? { ...a, presentCount: a.presentCount + 1 } : a);
    setMatching(false);
  };

  const pct = active ? (active.presentCount / active.course.studentsEnrolled) * 100 : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance Session"
        description="Run live AI face-recognition attendance for your class"
        icon={ClipboardCheck}
      />

      {!active ? (
        <Card>
          <CardHeader>
            <CardTitle>Start a new session</CardTitle>
            <CardDescription>Select a course to begin marking attendance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-[1fr_auto]">
              <Select value={selected} onValueChange={setSelected}>
                <SelectTrigger><SelectValue placeholder="Select a course…" /></SelectTrigger>
                <SelectContent>
                  {courses.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.code} · {c.title} ({c.studentsEnrolled} students)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={start} className="bg-gradient-primary hover:opacity-95">
                <Play className="mr-2 h-4 w-4" /> Start session
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Active session header */}
          <Card className="border-success/40 bg-gradient-to-br from-success-soft to-card">
            <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-success" />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-wide text-success font-semibold">Live Session</p>
                  <p className="text-lg font-semibold">{active.course.code} · {active.course.title}</p>
                  <p className="text-xs text-muted-foreground">
                    Started {new Date(active.startedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} · {active.course.teacherName}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-2xl font-bold">{active.presentCount} / {active.course.studentsEnrolled}</p>
                  <p className="text-xs text-muted-foreground">Marked present</p>
                </div>
                <Button variant="destructive" onClick={close}>
                  <Square className="mr-2 h-4 w-4" /> Close session
                </Button>
              </div>
            </CardContent>
            <div className="px-5 pb-5"><Progress value={pct} className="h-2" /></div>
          </Card>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Camera / capture */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Live capture</CardTitle>
                <CardDescription>Use the camera or upload an image to identify a student</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex aspect-video w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-soft text-primary">
                    <Camera className="h-7 w-7" />
                  </div>
                  <p className="mt-3 text-sm font-medium">Camera feed</p>
                  <p className="text-xs text-muted-foreground">Point camera at student's face to begin matching</p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button onClick={capture} disabled={matching} className="bg-gradient-primary">
                    {matching ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Matching…</> : <><Sparkles className="mr-2 h-4 w-4" /> Capture & match</>}
                  </Button>
                  <Button variant="outline" onClick={capture} disabled={matching}>
                    <Upload className="mr-2 h-4 w-4" /> Upload image instead
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Match result */}
            <Card>
              <CardHeader>
                <CardTitle>AI Match Result</CardTitle>
                <CardDescription>Latest recognized student</CardDescription>
              </CardHeader>
              <CardContent>
                {lastMatch ? (
                  <div className="text-center animate-fade-in">
                    <Avatar className="mx-auto h-20 w-20">
                      <AvatarFallback className="bg-gradient-primary text-xl font-semibold text-primary-foreground">
                        {lastMatch.student.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="mt-3 font-semibold">{lastMatch.student.name}</h3>
                    <p className="text-sm text-muted-foreground">{lastMatch.student.studentId}</p>
                    <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-success-soft px-3 py-1 text-xs font-semibold text-success">
                      <Sparkles className="h-3 w-3" />
                      {(lastMatch.confidence * 100).toFixed(1)}% confidence
                    </div>
                    <div className="mt-3"><StatusBadge status="present" /></div>
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                      <User className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">No match yet · capture to begin</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Live logs */}
          <Card>
            <CardHeader>
              <CardTitle>Live Attendance Log</CardTitle>
              <CardDescription>{logs.length} students marked in this session</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Student ID</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Confidence</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="py-8 text-center text-sm text-muted-foreground">
                          No attendance recorded yet
                        </TableCell>
                      </TableRow>
                    ) : logs.map((log) => (
                      <TableRow key={log.id} className="animate-fade-in">
                        <TableCell className="font-medium">{log.studentName}</TableCell>
                        <TableCell className="font-mono text-sm text-muted-foreground">{log.studentId}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                        </TableCell>
                        <TableCell><span className="font-mono text-xs font-semibold">{(log.confidence * 100).toFixed(1)}%</span></TableCell>
                        <TableCell><StatusBadge status={log.status} /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
