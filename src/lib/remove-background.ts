/**
 * Remove solid-color background from an image using flood-fill from corners.
 * Only removes the outer connected region — interior matching pixels are preserved.
 */
export async function removeSolidBackground(
  file: File,
  tolerance: number = 30,
): Promise<File> {
  const img = await loadImage(file);
  const canvas = document.createElement("canvas");
  const w = (canvas.width = img.width);
  const h = (canvas.height = img.height);
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0);

  const imageData = ctx.getImageData(0, 0, w, h);
  const data = imageData.data;

  // Sample corners to find the dominant background color
  const corners = [
    getPixel(data, w, 0, 0),
    getPixel(data, w, w - 1, 0),
    getPixel(data, w, 0, h - 1),
    getPixel(data, w, w - 1, h - 1),
  ];
  const bgColor = mostCommonColor(corners);

  // Flood-fill from all four corners to mark only outer background pixels
  const visited = new Uint8Array(w * h);
  const stack: number[] = [];

  const tryEnqueue = (x: number, y: number) => {
    if (x < 0 || x >= w || y < 0 || y >= h) return;
    const idx = y * w + x;
    if (visited[idx]) return;
    const i = idx * 4;
    const dr = data[i] - bgColor[0];
    const dg = data[i + 1] - bgColor[1];
    const db = data[i + 2] - bgColor[2];
    if (Math.sqrt(dr * dr + dg * dg + db * db) < tolerance) {
      visited[idx] = 1;
      stack.push(idx);
    }
  };

  // Seed from corners
  tryEnqueue(0, 0);
  tryEnqueue(w - 1, 0);
  tryEnqueue(0, h - 1);
  tryEnqueue(w - 1, h - 1);

  // BFS flood fill
  while (stack.length > 0) {
    const idx = stack.pop()!;
    const x = idx % w;
    const y = (idx - x) / w;
    tryEnqueue(x - 1, y);
    tryEnqueue(x + 1, y);
    tryEnqueue(x, y - 1);
    tryEnqueue(x, y + 1);
  }

  // Make only visited (outer background) pixels transparent
  for (let i = 0; i < visited.length; i++) {
    if (visited[i]) {
      data[i * 4 + 3] = 0;
    }
  }

  ctx.putImageData(imageData, 0, 0);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("toBlob failed"))),
      "image/png",
    );
  });

  return new File([blob], file.name.replace(/\.[^.]+$/, "") + "_nobg.png", {
    type: "image/png",
  });
}

function getPixel(
  data: Uint8ClampedArray,
  width: number,
  x: number,
  y: number,
): [number, number, number] {
  const i = (y * width + x) * 4;
  return [data[i], data[i + 1], data[i + 2]];
}

function mostCommonColor(
  colors: [number, number, number][],
): [number, number, number] {
  // Group similar colors (within distance 30) and return the largest group's average
  const groups: [number, number, number][][] = [];
  for (const c of colors) {
    let found = false;
    for (const g of groups) {
      const ref = g[0];
      const d = Math.sqrt(
        (c[0] - ref[0]) ** 2 + (c[1] - ref[1]) ** 2 + (c[2] - ref[2]) ** 2,
      );
      if (d < 30) {
        g.push(c);
        found = true;
        break;
      }
    }
    if (!found) groups.push([c]);
  }

  const largest = groups.sort((a, b) => b.length - a.length)[0];
  const avg: [number, number, number] = [0, 0, 0];
  for (const c of largest) {
    avg[0] += c[0];
    avg[1] += c[1];
    avg[2] += c[2];
  }
  return [
    Math.round(avg[0] / largest.length),
    Math.round(avg[1] / largest.length),
    Math.round(avg[2] / largest.length),
  ];
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}
