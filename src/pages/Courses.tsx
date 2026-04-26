import { useEffect, useState } from "react";
import { BookOpen, Plus, Users } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { api } from "@/services/api";
import type { Course } from "@/types";
import { toast } from "sonner";

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => { api.getCourses().then(setCourses); }, []);

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newCourse: Course = {
      id: `c-${Date.now()}`,
      code: String(fd.get("code") || ""),
      title: String(fd.get("title") || ""),
      department: String(fd.get("department") || ""),
      section: String(fd.get("section") || ""),
      teacherId: "t-new",
      teacherName: String(fd.get("teacher") || ""),
      studentsEnrolled: 0,
      schedule: "TBD",
    };
    setCourses((prev) => [newCourse, ...prev]);
    toast.success("Course created");
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Courses"
        description="All active courses across departments"
        icon={BookOpen}
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary hover:opacity-95">
                <Plus className="mr-2 h-4 w-4" /> Create course
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Create new course</DialogTitle>
                <DialogDescription>Set up a new course and assign a teacher.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5"><Label>Course code</Label><Input name="code" placeholder="CS-301" required /></div>
                  <div className="space-y-1.5"><Label>Section</Label><Input name="section" placeholder="A" required /></div>
                </div>
                <div className="space-y-1.5"><Label>Course title</Label><Input name="title" placeholder="Data Structures & Algorithms" required /></div>
                <div className="space-y-1.5"><Label>Department</Label><Input name="department" placeholder="Computer Science" required /></div>
                <div className="space-y-1.5"><Label>Assigned teacher</Label><Input name="teacher" placeholder="Dr. Sarah Ahmed" required /></div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                  <Button type="submit" className="bg-gradient-primary">Create</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Section</TableHead>
                  <TableHead>Teacher</TableHead>
                  <TableHead>Enrolled</TableHead>
                  <TableHead>Schedule</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-mono text-sm font-semibold">{c.code}</TableCell>
                    <TableCell className="font-medium">{c.title}</TableCell>
                    <TableCell className="text-muted-foreground">{c.department}</TableCell>
                    <TableCell>{c.section}</TableCell>
                    <TableCell>{c.teacherName}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-primary-soft px-2 py-0.5 text-xs font-medium text-primary">
                        <Users className="h-3 w-3" />
                        {c.studentsEnrolled}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{c.schedule}</TableCell>
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
