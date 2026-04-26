import { useState } from "react";
import { Settings as SettingsIcon, User, Server, Cpu, KeyRound, Save } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function SettingsPage() {
  const { user } = useAuth();
  const [threshold, setThreshold] = useState([85]);
  const [mode, setMode] = useState("insightface");

  const save = () => toast.success("Settings saved");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your profile, system preferences, and AI engine configuration"
        icon={SettingsIcon}
      />

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile"><User className="mr-2 h-4 w-4" /> Profile</TabsTrigger>
          <TabsTrigger value="system"><Server className="mr-2 h-4 w-4" /> System</TabsTrigger>
          <TabsTrigger value="ai"><Cpu className="mr-2 h-4 w-4" /> AI Engine</TabsTrigger>
          <TabsTrigger value="api"><KeyRound className="mr-2 h-4 w-4" /> API</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile information</CardTitle>
              <CardDescription>Update your personal account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5"><Label>Full name</Label><Input defaultValue={user?.name} /></div>
                <div className="space-y-1.5"><Label>Email</Label><Input type="email" defaultValue={user?.email} /></div>
                <div className="space-y-1.5"><Label>Role</Label><Input value={user?.role} disabled className="capitalize" /></div>
                <div className="space-y-1.5"><Label>Phone</Label><Input placeholder="+1 234 567 8900" /></div>
              </div>
              <div className="flex justify-end"><Button onClick={save} className="bg-gradient-primary"><Save className="mr-2 h-4 w-4" /> Save changes</Button></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <Card>
            <CardHeader><CardTitle>System preferences</CardTitle><CardDescription>Notifications and global behavior</CardDescription></CardHeader>
            <CardContent className="space-y-5">
              {[
                { label: "Email notifications", desc: "Receive daily attendance summaries by email" },
                { label: "Browser push notifications", desc: "Real-time alerts when sessions complete" },
                { label: "Auto-close idle sessions", desc: "Automatically close sessions after 90 minutes of inactivity" },
                { label: "Strict face matching", desc: "Reject matches below the configured threshold without retry" },
              ].map((row, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <p className="font-medium">{row.label}</p>
                    <p className="text-sm text-muted-foreground">{row.desc}</p>
                  </div>
                  <Switch defaultChecked={i < 2} />
                </div>
              ))}
              <div className="flex justify-end"><Button onClick={save} className="bg-gradient-primary"><Save className="mr-2 h-4 w-4" /> Save changes</Button></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai">
          <Card>
            <CardHeader><CardTitle>AI Engine configuration</CardTitle><CardDescription>Tune the face-recognition pipeline</CardDescription></CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Face match threshold</Label>
                  <span className="font-mono text-sm font-semibold text-primary">{threshold[0]}%</span>
                </div>
                <Slider value={threshold} onValueChange={setThreshold} min={50} max={99} step={1} />
                <p className="text-xs text-muted-foreground">
                  Confidence percentage required before a match is accepted as valid attendance.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Model mode</Label>
                <Select value={mode} onValueChange={setMode}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mock">Mock Mode (development)</SelectItem>
                    <SelectItem value="insightface">InsightFace Mode (production)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {mode === "mock" ? "Random matches for UI testing without GPU." : "High-accuracy ArcFace model · requires GPU node."}
                </p>
              </div>

              <div className="flex justify-end"><Button onClick={save} className="bg-gradient-primary"><Save className="mr-2 h-4 w-4" /> Save changes</Button></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api">
          <Card>
            <CardHeader><CardTitle>API endpoints</CardTitle><CardDescription>Configure backend service URLs (placeholder)</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5"><Label>Base API URL</Label><Input defaultValue="https://api.eaas.university.edu/v1" /></div>
              <div className="space-y-1.5"><Label>Vector DB endpoint</Label><Input defaultValue="https://vector.eaas.university.edu" /></div>
              <div className="space-y-1.5"><Label>Inference worker URL</Label><Input defaultValue="https://inference.eaas.university.edu" /></div>
              <div className="space-y-1.5"><Label>API key</Label><Input type="password" defaultValue="••••••••••••••••" /></div>
              <div className="flex justify-end"><Button onClick={save} className="bg-gradient-primary"><Save className="mr-2 h-4 w-4" /> Save changes</Button></div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
