import { useState } from "react";
import { Download, Smartphone, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import IconUploader from "@/components/IconUploader";
import ColorPicker from "@/components/ColorPicker";
import AdaptivePreview from "@/components/AdaptivePreview";
import { GradientOption, generateAdaptiveIcon } from "@/lib/adaptive-icon";

const Index = () => {
  const [file, setFile] = useState<File | null>(null);
  const [colorOption, setColorOption] = useState<GradientOption | null>(null);
  const [processing, setProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const canProcess = file && colorOption && !processing;

  const handleProcess = async () => {
    if (!file || !colorOption) return;
    setProcessing(true);
    setResultUrl(null);
    try {
      const dataUrl = await generateAdaptiveIcon(file, colorOption);
      setResultUrl(dataUrl);
    } catch (err) {
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultUrl) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = "adaptive-icon.png";
    a.click();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-medium mb-4">
            <Smartphone className="w-3.5 h-3.5" />
            Adaptive Icon Generator
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Create Adaptive Icons
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Upload your icon, pick a background — we'll remove the solid background, fit the content to 676×676, and pad it to 1024×1024.
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
          <div>
            <label className="text-sm font-semibold text-foreground mb-3 block">
              1. Upload Icon
            </label>
            <IconUploader file={file} preview={file ? URL.createObjectURL(file) : null} onFileChange={(f) => { setFile(f); setResultUrl(null); }} />
          </div>

          <div>
            <label className="text-sm font-semibold text-foreground mb-3 block">
              2. Choose Background
            </label>
            <ColorPicker selected={colorOption} onSelect={(o) => { setColorOption(o); setResultUrl(null); }} />
          </div>

          <Button
            onClick={handleProcess}
            disabled={!canProcess}
            className="w-full h-12 text-sm font-semibold"
            size="lg"
          >
            {processing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing…
              </>
            ) : (
              "Generate Icon"
            )}
          </Button>

          {resultUrl && (
            <div className="space-y-4">
              <AdaptivePreview resultUrl={resultUrl} colorOption={colorOption} />
              <Button
                onClick={handleDownload}
                className="w-full h-12 text-sm font-semibold"
                size="lg"
                variant="outline"
              >
                <Download className="w-4 h-4 mr-2" />
                Download PNG (1024×1024)
              </Button>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          All processing happens in your browser. No files are uploaded to any server.
        </p>
      </div>
    </div>
  );
};

export default Index;
