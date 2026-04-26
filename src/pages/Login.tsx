import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScanFace, Sparkles, ShieldCheck, Activity, Lock, Mail } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [role, setRole] = useState<"admin" | "teacher">("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter your email and password");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      login(email, role);
      toast.success(`Welcome back, ${role === "admin" ? "Admin" : "Teacher"}!`);
      navigate("/dashboard");
    }, 700);
  };

  const useDemo = () => {
    setEmail(role === "admin" ? "admin@university.edu" : "teacher@university.edu");
    setPassword("demo1234");
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left — branding */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-hero p-12 text-white lg:flex">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.18),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.12),transparent_50%)]" />

        <div className="relative">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-lg font-semibold">Enterprise AI</span>
          </div>
        </div>

        <div className="relative space-y-6">
          <h1 className="text-4xl font-bold leading-tight tracking-tight xl:text-5xl">
            AI-powered face recognition attendance for large institutions.
          </h1>
          <p className="text-lg text-white/85">
            Manage 25,000+ students, real-time sessions, and analytics — built for universities and enterprise campuses.
          </p>

          <div className="grid grid-cols-3 gap-4 pt-6">
            {[
              { icon: ScanFace, label: "Face Match", value: "99.4%" },
              { icon: Activity, label: "Live Sessions", value: "42" },
              { icon: ShieldCheck, label: "Profiles", value: "123K+" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                <s.icon className="h-5 w-5 text-white/80" />
                <p className="mt-3 text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-white/70">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-sm text-white/60">
          © {new Date().getFullYear()} Enterprise AI Attendance · Trusted by leading universities
        </p>
      </div>

      {/* Right — form */}
      <div className="flex items-center justify-center p-6 md:p-12">
        <Card className="w-full max-w-md border-0 shadow-elegant md:border">
          <div className="p-8">
            <div className="mb-6 lg:hidden">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground">
                  <Sparkles className="h-5 w-5" />
                </div>
                <span className="font-semibold">Enterprise AI Attendance</span>
              </div>
            </div>

            <h2 className="text-2xl font-bold tracking-tight">Sign in to your account</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Enter your credentials to access the dashboard
            </p>

            <Tabs value={role} onValueChange={(v) => setRole(v as "admin" | "teacher")} className="mt-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="admin">Admin</TabsTrigger>
                <TabsTrigger value="teacher">Teacher</TabsTrigger>
              </TabsList>
              <TabsContent value="admin" className="mt-2 text-xs text-muted-foreground">
                Full access · manage users, courses, system settings
              </TabsContent>
              <TabsContent value="teacher" className="mt-2 text-xs text-muted-foreground">
                Run attendance sessions and view course reports
              </TabsContent>
            </Tabs>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9"
                    autoComplete="email"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <button type="button" className="text-xs font-medium text-primary hover:underline">
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9"
                    autoComplete="current-password"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full bg-gradient-primary hover:opacity-95" disabled={loading}>
                {loading ? "Signing in…" : `Sign in as ${role === "admin" ? "Admin" : "Teacher"}`}
              </Button>

              <Button type="button" variant="outline" className="w-full" onClick={useDemo}>
                Use demo credentials
              </Button>
            </form>

            <p className="mt-6 text-center text-xs text-muted-foreground">
              By continuing, you agree to our Terms and Privacy Policy.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
