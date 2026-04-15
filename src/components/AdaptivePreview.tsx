import { GradientOption } from "@/lib/adaptive-icon";

interface AdaptivePreviewProps {
  resultUrl: string;
  colorOption: GradientOption | null;
}

const AdaptivePreview = ({ resultUrl, colorOption }: AdaptivePreviewProps) => {
  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-sm font-medium text-muted-foreground">Preview</p>
      <div className="flex items-center gap-6">
        {/* Square */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="w-16 h-16 rounded-xl overflow-hidden shadow-lg">
            <img src={resultUrl} alt="Square preview" className="w-full h-full object-cover" />
          </div>
          <span className="text-[10px] text-muted-foreground">Square</span>
        </div>
        {/* Circle */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="w-16 h-16 rounded-full overflow-hidden shadow-lg">
            <img src={resultUrl} alt="Circle preview" className="w-full h-full object-cover" />
          </div>
          <span className="text-[10px] text-muted-foreground">Circle</span>
        </div>
        {/* Squircle */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="w-16 h-16 overflow-hidden shadow-lg" style={{ borderRadius: "28%" }}>
            <img src={resultUrl} alt="Squircle preview" className="w-full h-full object-cover" />
          </div>
          <span className="text-[10px] text-muted-foreground">Squircle</span>
        </div>
      </div>
      {/* Full size preview */}
      <div className="mt-2 w-full max-w-[200px] aspect-square rounded-lg overflow-hidden border border-border"
        style={{ background: "repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%) 50% / 16px 16px" }}>
        <img src={resultUrl} alt="Full preview" className="w-full h-full object-contain" />
      </div>
    </div>
  );
};

export default AdaptivePreview;
