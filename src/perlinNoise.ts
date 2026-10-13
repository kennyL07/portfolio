let p: number[] = new Array(512);
let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let asciiColorRamp = "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,\"^`'. ";

export function setupPerlinNoiseBackground(element: HTMLElement): void {
  canvas = document.createElement('canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  element.appendChild(canvas);
  ctx = canvas.getContext('2d');
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  ctx.fillStyle = 'white';
  ctx.font = '10px monospace';
  const seed = Math.floor(Math.random() * 10000);

  const permutation = [
    151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225,
    140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148,
    247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32,
    57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175,
    74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122,
    60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54,
    65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169,
    200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64,
    52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212,
    207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213,
    119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9,
    129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104,
    218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241,
    81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157,
    184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93,
    222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180
  ];

  for (let i = permutation.length - 1; i > 0; i--) {
    const j = Math.abs((seed ^ i) % (i + 1));
    [permutation[i], permutation[j]] = [permutation[j], permutation[i]];
  }

  for (let i = 0; i < 256; i++) {
    p[i] = permutation[i];
    p[256 + i] = permutation[i];
  }
}

export function updateNoise(counter: number): void {
  if (!canvas || !ctx) return;

  const width = canvas.width;
  const height = canvas.height;
  
  ctx.clearRect(0, 0, width, height);

  const scale = 0.001; 
  
  for (let y = 0; y < height; y += 12) {
    for (let x = 0; x < width; x += 12) {
      const sampleX = (x + counter * 2) * scale;
      const sampleY = (y) * scale;

      const noiseVal = sampleNoise2D(sampleX, sampleY);

      const colorIntensity = clamp(Math.floor((noiseVal + 1) * 127.5), 0, 200);
      const index = Math.floor(colorIntensity / 200 * (asciiColorRamp.length - 1));


      ctx.fillText(asciiColorRamp[index], x, y);        
    }
  }
}

function sampleNoise2D(x: number, y: number): number {
  let X = Math.floor(x) & 255;
  let Y = Math.floor(y) & 255;

  x -= Math.floor(x);
  y -= Math.floor(y);

  const u = fade(x);
  const v = fade(y);

  const A = p[X] + Y;
  const AA = p[A];
  const AB = p[A + 1];
  const B = p[X + 1] + Y;
  const BA = p[B];
  const BB = p[B + 1];

  return lerp(v,
    lerp(u, grad(p[AA], x, y), grad(p[BA], x - 1, y)),
    lerp(u, grad(p[AB], x, y - 1), grad(p[BB], x - 1, y - 1))
  );
}

function fade(t: number): number {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function lerp(t: number, a: number, b: number): number {
  return a + t * (b - a);
}

function grad(hash: number, x: number, y: number): number {
  const h = hash & 7;
  const u = h < 4 ? x : y;
  const v = h < 4 ? y : x;
  return ((h & 1) ? -u : u) + ((h & 2) ? -2.0 * v : 2.0 * v);
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}


