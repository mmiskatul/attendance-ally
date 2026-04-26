import { useEffect, useState } from "react";
import { BarChart3, Download, Calendar, UserCheck, UserX, Percent } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { api } from "@/services/api";
import { mockStudents } from "@/data/mockData";
import { toast } from "sonner";

export default function Reports() {
  const [data, setData] = useState<Array<{ department: string; present: number; absent: number }>>([]);

  useEffect(() => { api.getDepartmentReport().then(setData); }, []);

  const summary = data.reduce(
    (acc, d) => ({ present: acc.present + d.present, absent: acc.absent + d.absent }),
    { present: 0, absent: 0 }
  );
  const attendanceRate = summary.present + summary.absent > 0
    ? ((summary.present / (summary.present + summary.absent)) * 100).toFixed(1)
    : "0";

  const exportCsv = () => {
    const rows = [["Department", "Present", "Absent"], ...data.map((d) => [d.department, d.present, d.absent])];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "attendance-report.csv"; a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Analyze attendance trends across departments, courses, and students"
        icon={BarChart3}
        actions={
          <Button onClick={exportCsv} className="bg-gradient-primary hover:opacity-95">
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
        }
      />

      {/* Filters */}
      <Card>
        <CardContent className="grid gap-3 p-5 md:grid-cols-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Date range</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input type="date" className="pl-9" defaultValue="2025-04-01" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Course</Label>
            <Select defaultValue="all">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All courses</SelectItem>
                <SelectItem value="cs-301">CS-301</SelectItem>
                <SelectItem value="cs-401">CS-401</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Department</Label>
            <Select defaultValue="all">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All departments</SelectItem>
                <SelectItem value="cs">Computer Science</SelectItem>
                <SelectItem value="ee">Electrical Engineering</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Section</Label>
            <Select defaultValue="all">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All sections</SelectItem>
                <SelectItem value="a">Section A</SelectItem>
                <SelectItem value="b">Section B</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Present" value={summary.present} icon={UserCheck} iconColor="success" trend={{ value: 5.2 }} />
        <StatCard label="Total Absent" value={summary.absent} icon={UserX} iconColor="destructive" trend={{ value: -2.1 }} />
        <StatCard label="Attendance Rate" value={`${attendanceRate}%`} icon={Percent} iconColor="primary" trend={{ value: 3.4 }} />
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Present vs Absent by Department</CardTitle>
          <CardDescription>Aggregate attendance across all courses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 10, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="department" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="present" fill="hsl(var(--success))" radius={[6, 6, 0, 0]} />
                <Bar dataKey="absent" fill="hsl(var(--destructive))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Student-wise table */}
      <Card>
        <CardHeader>
          <CardTitle>Student-wise Report</CardTitle>
          <CardDescription>Attendance percentage per student</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Classes Held</TableHead>
                  <TableHead>Attended</TableHead>
                  <TableHead>%</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockStudents.slice(0, 10).map((s, i) => {
                  const held = 30;
                  const attended = 18 + ((i * 3) % 12);
                  const pct = ((attended / held) * 100).toFixed(0);
                  const good = Number(pct) >= 75;
                  return (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell className="font-mono text-sm text-muted-foreground">{s.studentId}</TableCell>
                      <TableCell className="text-muted-foreground">{s.department}</TableCell>
                      <TableCell>{held}</TableCell>
                      <TableCell>{attended}</TableCell>
                      <TableCell>
                        <span className={`inline-flex rounded-md px-2 py-0.5 text-xs font-semibold ${good ? "bg-success-soft text-success" : "bg-warning-soft text-warning"}`}>
                          {pct}%
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
