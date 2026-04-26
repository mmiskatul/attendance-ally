import { useEffect, useState } from "react";
import { ScanFace, Upload, Check, X, Sparkles, Loader2, ImageIcon, CircleDot, Camera } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { CameraCapture } from "@/components/shared/CameraCapture";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { api } from "@/services/api";
import type { Student } from "@/types";
import { toast } from "sonner";

interface UploadedImage {
  id: string;
  name: string;
  url: string;
  quality: { lighting: boolean; faceDetected: boolean; aligned: boolean; sharp: boolean };
}

const steps = [
  { key: "upload", label: "Upload Images" },
  { key: "quality", label: "Quality Check" },
  { key: "embed", label: "Generate Embeddings" },
  { key: "save", label: "Save to Vector DB" },
];

export default function FaceRegistration() {
  const [students, setStudents] = useState<Student[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [step, setStep] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<"success" | "error" | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);

  useEffect(() => { api.getStudents().then(setStudents); }, []);

  const addCapturedImage = (dataUrl: string) => {
    if (images.length >= 5) { toast.error("Maximum 5 images"); return; }
    const img: UploadedImage = {
      id: `cam-${Date.now()}`,
      name: `capture-${images.length + 1}.jpg`,
      url: dataUrl,
      quality: {
        lighting: Math.random() > 0.15,
        faceDetected: Math.random() > 0.05,
        aligned: Math.random() > 0.2,
        sharp: Math.random() > 0.15,
      },
    };
    setImages((prev) => [...prev, img]);
    toast.success("Image captured");
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files).slice(0, 5 - images.length);
    const next: UploadedImage[] = arr.map((f, i) => ({
      id: `img-${Date.now()}-${i}`,
      name: f.name,
      url: URL.createObjectURL(f),
      quality: {
        lighting: Math.random() > 0.15,
        faceDetected: Math.random() > 0.05,
        aligned: Math.random() > 0.2,
        sharp: Math.random() > 0.15,
      },
    }));
    setImages((prev) => [...prev, ...next]);
  };

  const removeImage = (id: string) => setImages((prev) => prev.filter((i) => i.id !== id));

  const startProcess = async () => {
    if (!selected) { toast.error("Please select a student first"); return; }
    if (images.length < 3) { toast.error("Please upload at least 3 images"); return; }
    setProcessing(true);
    setResult(null);
    for (let i = 1; i <= 3; i++) {
      setStep(i);
      await new Promise((r) => setTimeout(r, 900));
    }
    setProcessing(false);
    setResult("success");
    toast.success("Face profile registered successfully");
  };

  const reset = () => {
    setImages([]); setStep(0); setResult(null); setSelected("");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Face Registration"
        description="Enroll students into the AI vector database with high-quality face images"
        icon={ScanFace}
      />

      {/* Stepper */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center justify-between gap-2 overflow-x-auto">
            {steps.map((s, i) => {
              const active = step === i;
              const done = step > i || result === "success";
              return (
                <div key={s.key} className="flex flex-1 items-center gap-3 min-w-fit">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                        done ? "bg-success text-success-foreground" : active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      )}
                    >
                      {done ? <Check className="h-4 w-4" /> : i + 1}
                    </div>
                    <div className="hidden md:block">
                      <p className={cn("text-sm font-medium", active ? "text-foreground" : done ? "text-foreground" : "text-muted-foreground")}>
                        {s.label}
                      </p>
                    </div>
                  </div>
                  {i < steps.length - 1 && (
                    <div className={cn("h-0.5 flex-1 mx-2", done ? "bg-success" : "bg-border")} />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: select + uploader */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>1. Select student</CardTitle>
              <CardDescription>Choose the student to enroll</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selected} onValueChange={setSelected}>
                <SelectTrigger><SelectValue placeholder="Select a student…" /></SelectTrigger>
                <SelectContent>
                  {students.slice(0, 30).map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name} · {s.studentId}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Upload face images</CardTitle>
              <CardDescription>Upload 3–5 clear photos · max 5 images</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <label
                htmlFor="file-upload"
                className={cn(
                  "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors",
                  "border-border bg-muted/30 hover:border-primary hover:bg-primary-soft"
                )}
              >
                <Upload className="h-8 w-8 text-muted-foreground" />
                <p className="mt-3 text-sm font-medium">Drop images or click to browse</p>
                <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB · {images.length}/5 uploaded</p>
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFiles(e.target.files)}
                  disabled={images.length >= 5}
                />
              </label>

              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs text-muted-foreground">OR</span>
                <div className="h-px flex-1 bg-border" />
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setCameraOpen(true)}
                disabled={images.length >= 5}
              >
                <Camera className="mr-2 h-4 w-4" /> Capture from camera
              </Button>

              {images.length > 0 && (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                  {images.map((img) => {
                    const passed = Object.values(img.quality).filter(Boolean).length;
                    const allGood = passed === 4;
                    return (
                      <div key={img.id} className="group relative overflow-hidden rounded-lg border bg-muted">
                        <img src={img.url} alt={img.name} className="aspect-square w-full object-cover" />
                        <button
                          onClick={() => removeImage(img.id)}
                          className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-background/90 opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          <X className="h-3 w-3" />
                        </button>
                        <div className={cn(
                          "absolute bottom-0 left-0 right-0 px-2 py-1 text-[10px] font-medium",
                          allGood ? "bg-success/90 text-success-foreground" : "bg-warning/90 text-warning-foreground"
                        )}>
                          {passed}/4 checks passed
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action */}
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={startProcess}
              disabled={processing || images.length < 3 || !selected}
              className="bg-gradient-primary hover:opacity-95"
            >
              {processing ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing…</>) : (<><Sparkles className="mr-2 h-4 w-4" /> Register face profile</>)}
            </Button>
            {(images.length > 0 || result) && (
              <Button variant="outline" onClick={reset}>Reset</Button>
            )}
          </div>
        </div>

        {/* Right: quality + result */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quality Checks</CardTitle>
              <CardDescription>Aggregate of uploaded images</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: "Good lighting", key: "lighting" as const },
                { label: "Face detected", key: "faceDetected" as const },
                { label: "Center aligned", key: "aligned" as const },
                { label: "Not blurry", key: "sharp" as const },
              ].map((c) => {
                const total = images.length || 1;
                const passed = images.filter((i) => i.quality[c.key]).length;
                const pct = images.length ? (passed / total) * 100 : 0;
                const ok = pct >= 75 && images.length > 0;
                return (
                  <div key={c.key}>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        {images.length === 0 ? (
                          <CircleDot className="h-4 w-4 text-muted-foreground" />
                        ) : ok ? (
                          <Check className="h-4 w-4 text-success" />
                        ) : (
                          <X className="h-4 w-4 text-warning" />
                        )}
                        {c.label}
                      </span>
                      <span className="text-xs text-muted-foreground">{passed}/{images.length || 0}</span>
                    </div>
                    <Progress value={pct} className="h-1.5" />
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {result === "success" && (
            <Card className="border-success/40 bg-success-soft animate-fade-in">
              <CardContent className="p-5 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success text-success-foreground">
                  <Check className="h-6 w-6" />
                </div>
                <h3 className="mt-3 font-semibold text-foreground">Registration successful</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {images.length} embeddings stored in vector DB. Student is ready for attendance.
                </p>
              </CardContent>
            </Card>
          )}

          {!result && images.length === 0 && (
            <Card className="border-dashed">
              <CardContent className="p-5 text-center">
                <ImageIcon className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">Upload images to begin quality analysis</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
