import { COLOR_OPTIONS, GradientOption } from "@/lib/adaptive-icon";
import { cn } from "@/lib/utils";

interface ColorPickerProps {
  selected: GradientOption | null;
  onSelect: (option: GradientOption) => void;
}

const ColorPicker = ({ selected, onSelect }: ColorPickerProps) => {
  const solids = COLOR_OPTIONS.filter((o) => o.type === "solid");
  const gradients = COLOR_OPTIONS.filter((o) => o.type === "gradient");

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-2">Solid Colors</p>
        <div className="grid grid-cols-5 gap-2">
          {solids.map((opt) => (
            <button
              key={opt.id}
              onClick={() => onSelect(opt)}
              className={cn(
                "w-full aspect-square rounded-lg border-2 transition-all hover:scale-105",
                selected?.id === opt.id
                  ? "border-primary ring-2 ring-primary/30 scale-105"
                  : "border-border hover:border-muted-foreground"
              )}
              style={{ background: opt.css }}
              title={opt.label}
            />
          ))}
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-2">Gradients</p>
        <div className="grid grid-cols-4 gap-2">
          {gradients.map((opt) => (
            <button
              key={opt.id}
              onClick={() => onSelect(opt)}
              className={cn(
                "w-full aspect-square rounded-lg border-2 transition-all hover:scale-105",
                selected?.id === opt.id
                  ? "border-primary ring-2 ring-primary/30 scale-105"
                  : "border-border hover:border-muted-foreground"
              )}
              style={{ background: opt.css }}
              title={opt.label}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;
