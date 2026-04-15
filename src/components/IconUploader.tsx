import { useCallback, useRef } from "react";
import { Upload, X, Image } from "lucide-react";
import { cn } from "@/lib/utils";

interface IconUploaderProps {
  file: File | null;
  preview: string | null;
  onFileChange: (file: File | null) => void;
}

const IconUploader = ({ file, preview, onFileChange }: IconUploaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const f = e.dataTransfer.files[0];
      if (f && f.type.startsWith("image/")) onFileChange(f);
    },
    [onFileChange]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) onFileChange(f);
  };

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      onClick={() => !file && inputRef.current?.click()}
      className={cn(
        "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all",
        "aspect-square max-w-[280px] w-full mx-auto",
        file
          ? "border-primary/40 bg-accent/30"
          : "border-border hover:border-primary/50 hover:bg-accent/20 cursor-pointer"
      )}
    >
      <input ref={inputRef} type="file" accept="image/*" onChange={handleChange} className="hidden" />
      {preview ? (
        <>
          <img src={preview} alt="Icon preview" className="w-full h-full object-contain rounded-lg p-3" />
          <div className="absolute top-2 right-2">
            <button
              onClick={(e) => { e.stopPropagation(); onFileChange(null); }}
              className="p-1.5 rounded-full bg-foreground/10 hover:bg-destructive/20 text-foreground/60 hover:text-destructive transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center gap-2 text-muted-foreground p-6">
          <div className="p-3 rounded-full bg-accent">
            <Upload className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium">Drop your icon here</p>
          <p className="text-xs">or click to browse</p>
          <div className="flex items-center gap-1 text-xs mt-1 opacity-60">
            <Image className="w-3 h-3" /> PNG with or without background
          </div>
        </div>
      )}
    </div>
  );
};

export default IconUploader;
