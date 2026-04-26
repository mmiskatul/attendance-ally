import { useEffect, useMemo, useState } from "react";
import { Users, Plus, Search, Filter, Download, ScanFace, MoreVertical, Eye, Edit } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/services/api";
import type { Student } from "@/types";
import { toast } from "sonner";

export default function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState("all");
  const [status, setStatus] = useState("all");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getStudents().then((s) => { setStudents(s); setLoading(false); });
  }, []);

  const departments = useMemo(
    () => Array.from(new Set(students.map((s) => s.department))),
    [students]
  );

  const filtered = students.filter((s) => {
    const q = search.toLowerCase();
    const matchesSearch = !q || s.name.toLowerCase().includes(q) || s.studentId.toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
    const matchesDept = dept === "all" || s.department === dept;
    const matchesStatus = status === "all" || s.status === status;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newStudent: Student = {
      id: `stu-${Date.now()}`,
      studentId: String(fd.get("studentId") || ""),
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      department: String(fd.get("department") || ""),
      batch: String(fd.get("batch") || ""),
      section: String(fd.get("section") || ""),
      faceProfiles: 0,
      status: "pending",
      enrolledAt: new Date().toISOString(),
    };
    setStudents((prev) => [newStudent, ...prev]);
    toast.success("Student added successfully");
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Students"
        description="Manage all enrolled students and their face profiles"
        icon={Users}
        actions={
          <>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-primary hover:opacity-95">
                  <Plus className="mr-2 h-4 w-4" /> Add Student
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Add new student</DialogTitle>
                  <DialogDescription>Enter the student's details to enroll them in the system.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAdd} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5"><Label>Student ID</Label><Input name="studentId" placeholder="2024-CS-0123" required /></div>
                    <div className="space-y-1.5"><Label>Full name</Label><Input name="name" placeholder="John Doe" required /></div>
                  </div>
                  <div className="space-y-1.5"><Label>Email</Label><Input name="email" type="email" placeholder="john@university.edu" required /></div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1.5"><Label>Department</Label><Input name="department" placeholder="CS" required /></div>
                    <div className="space-y-1.5"><Label>Batch</Label><Input name="batch" placeholder="2024" required /></div>
                    <div className="space-y-1.5"><Label>Section</Label><Input name="section" placeholder="A" required /></div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button type="submit" className="bg-gradient-primary">Add student</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </>
        }
      />

      <Card>
        <CardContent className="p-4 md:p-5">
          {/* Filters */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, ID, or email…"
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="hidden h-4 w-4 text-muted-foreground md:block" />
              <Select value={dept} onValueChange={setDept}>
                <SelectTrigger className="w-[180px]"><SelectValue placeholder="Department" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All departments</SelectItem>
                  {departments.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Batch</TableHead>
                  <TableHead>Section</TableHead>
                  <TableHead>Face Profiles</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[60px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={8}>
                        <div className="h-10 animate-pulse rounded bg-muted" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="py-12 text-center">
                      <div className="mx-auto flex max-w-sm flex-col items-center gap-2">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                          <Users className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <p className="font-medium">No students found</p>
                        <p className="text-sm text-muted-foreground">Try adjusting your filters or add a new student.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((s) => {
                    const initials = s.name.split(" ").map((n) => n[0]).slice(0, 2).join("");
                    return (
                      <TableRow key={s.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarFallback className="bg-primary-soft text-xs font-semibold text-primary">
                                {initials}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{s.name}</p>
                              <p className="text-xs text-muted-foreground">{s.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{s.studentId}</TableCell>
                        <TableCell>{s.department}</TableCell>
                        <TableCell>{s.batch}</TableCell>
                        <TableCell>{s.section}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2 py-0.5 text-xs font-medium">
                            <ScanFace className="h-3 w-3" />
                            {s.faceProfiles} / 5
                          </span>
                        </TableCell>
                        <TableCell><StatusBadge status={s.status} /></TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem><Eye className="mr-2 h-4 w-4" />View details</DropdownMenuItem>
                              <DropdownMenuItem><Edit className="mr-2 h-4 w-4" />Edit student</DropdownMenuItem>
                              <DropdownMenuItem><ScanFace className="mr-2 h-4 w-4" />Register face</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
            <p>Showing <span className="font-medium text-foreground">{filtered.length}</span> of <span className="font-medium text-foreground">25,420</span> students</p>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="outline" size="sm">Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
