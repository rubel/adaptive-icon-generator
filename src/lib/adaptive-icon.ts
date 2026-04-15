import { removeSolidBackground } from "./remove-background";

const OUTPUT_SIZE = 1024;
const CONTENT_SIZE = 676; // 1024 - 174*2
const PADDING = 174;

export interface GradientOption {
  id: string;
  label: string;
  type: "solid" | "gradient";
  colors: string[];
  angle?: number;
  css: string;
}

export const COLOR_OPTIONS: GradientOption[] = [
  { id: "transparent", label: "Transparent", type: "solid", colors: ["rgba(0,0,0,0)"], css: "repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%) 50% / 16px 16px" },
  { id: "white", label: "White", type: "solid", colors: ["#FFFFFF"], css: "#FFFFFF" },
  { id: "black", label: "Black", type: "solid", colors: ["#000000"], css: "#000000" },
  { id: "red", label: "Red", type: "solid", colors: ["#F44336"], css: "#F44336" },
  { id: "blue", label: "Blue", type: "solid", colors: ["#2196F3"], css: "#2196F3" },
  { id: "green", label: "Green", type: "solid", colors: ["#4CAF50"], css: "#4CAF50" },
  { id: "orange", label: "Orange", type: "solid", colors: ["#FF9800"], css: "#FF9800" },
  { id: "purple", label: "Purple", type: "solid", colors: ["#9C27B0"], css: "#9C27B0" },
  { id: "teal", label: "Teal", type: "solid", colors: ["#009688"], css: "#009688" },
  { id: "pink", label: "Pink", type: "solid", colors: ["#E91E63"], css: "#E91E63" },
  { id: "indigo", label: "Indigo", type: "solid", colors: ["#3F51B5"], css: "#3F51B5" },
  { id: "gradient-sunset", label: "Sunset", type: "gradient", colors: ["#FF512F", "#DD2476"], angle: 135, css: "linear-gradient(135deg, #FF512F, #DD2476)" },
  { id: "gradient-ocean", label: "Ocean", type: "gradient", colors: ["#2193b0", "#6dd5ed"], angle: 135, css: "linear-gradient(135deg, #2193b0, #6dd5ed)" },
  { id: "gradient-forest", label: "Forest", type: "gradient", colors: ["#11998e", "#38ef7d"], angle: 135, css: "linear-gradient(135deg, #11998e, #38ef7d)" },
  { id: "gradient-fire", label: "Fire", type: "gradient", colors: ["#f12711", "#f5af19"], angle: 135, css: "linear-gradient(135deg, #f12711, #f5af19)" },
  { id: "gradient-purple", label: "Violet", type: "gradient", colors: ["#7F00FF", "#E100FF"], angle: 135, css: "linear-gradient(135deg, #7F00FF, #E100FF)" },
  { id: "gradient-midnight", label: "Midnight", type: "gradient", colors: ["#232526", "#414345"], angle: 135, css: "linear-gradient(135deg, #232526, #414345)" },
  { id: "gradient-peach", label: "Peach", type: "gradient", colors: ["#ffecd2", "#fcb69f"], angle: 135, css: "linear-gradient(135deg, #ffecd2, #fcb69f)" },
  { id: "gradient-sky", label: "Sky", type: "gradient", colors: ["#a1c4fd", "#c2e9fb"], angle: 135, css: "linear-gradient(135deg, #a1c4fd, #c2e9fb)" },
];

/** Find bounding box of non-transparent pixels */
function getBoundingBox(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const imageData = ctx.getImageData(0, 0, w, h);
  const data = imageData.data;
  let minX = w, minY = h, maxX = 0, maxY = 0;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const alpha = data[(y * w + x) * 4 + 3];
      if (alpha > 10) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (maxX < minX) return { x: 0, y: 0, w, h }; // fallback: entire image
  return { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 };
}

function drawBackground(
  ctx: CanvasRenderingContext2D,
  size: number,
  option: GradientOption
) {
  if (option.id === "transparent") {
    // leave transparent
    return;
  }
  if (option.type === "solid") {
    ctx.fillStyle = option.colors[0];
    ctx.fillRect(0, 0, size, size);
  } else {
    const angle = (option.angle ?? 135) * (Math.PI / 180);
    const cx = size / 2;
    const cy = size / 2;
    const len = (size * Math.sqrt(2)) / 2;
    const x0 = cx - Math.cos(angle) * len;
    const y0 = cy - Math.sin(angle) * len;
    const x1 = cx + Math.cos(angle) * len;
    const y1 = cy + Math.sin(angle) * len;
    const grad = ctx.createLinearGradient(x0, y0, x1, y1);
    option.colors.forEach((c, i) => {
      grad.addColorStop(i / (option.colors.length - 1), c);
    });
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
  }
}

export async function generateAdaptiveIcon(
  imageFile: File,
  colorOption: GradientOption
): Promise<string> {
  // Step 1: Remove solid background
  const cleanedFile = await removeSolidBackground(imageFile);
  const img = await loadImage(cleanedFile);

  // Step 2: Find bounding box of content
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = img.width;
  tempCanvas.height = img.height;
  const tempCtx = tempCanvas.getContext("2d")!;
  tempCtx.drawImage(img, 0, 0);
  const bbox = getBoundingBox(tempCtx, img.width, img.height);

  // Step 3: Create 1024x1024 output
  const canvas = document.createElement("canvas");
  canvas.width = OUTPUT_SIZE;
  canvas.height = OUTPUT_SIZE;
  const ctx = canvas.getContext("2d")!;

  // Draw background
  drawBackground(ctx, OUTPUT_SIZE, colorOption);

  // Scale content to fit 676x676, maintaining aspect ratio
  const scale = Math.min(CONTENT_SIZE / bbox.w, CONTENT_SIZE / bbox.h);
  const scaledW = bbox.w * scale;
  const scaledH = bbox.h * scale;
  const offsetX = PADDING + (CONTENT_SIZE - scaledW) / 2;
  const offsetY = PADDING + (CONTENT_SIZE - scaledH) / 2;

  ctx.drawImage(
    tempCanvas,
    bbox.x, bbox.y, bbox.w, bbox.h,
    offsetX, offsetY, scaledW, scaledH
  );

  // Return data URL for preview and download
  return canvas.toDataURL("image/png");
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}
