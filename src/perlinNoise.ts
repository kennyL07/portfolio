let p: number[] = new Array(512);
let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let asciiColorRamp = "$@B%8&WM#oahkbdpqwmZO0QLCJUYXzcvunxrjft/\|()1{}[]?-_+~<>i!lI;:,*\"^`'. ";

export function setupPerlinNoiseBackground(element: HTMLElement): void {
  canvas = document.createElement('canvas');
  canvas.id = 'noise-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  element.appendChild(canvas);
  ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.fillStyle = getComputedStyle(element).getPropertyValue('--accent').trim();
  ctx.font = '.75rem monospace';
  const seed = Math.floor(Math.random() * 10000);
  const permutation = Array.from({ length: 256 }, (_, k) => k)
  .sort(() => Math.random() - 0.5);

  for (let i = permutation.length - 1; i > 0; i--) {
    const j = Math.abs((seed ^ i) % (i + 1));
    [permutation[i], permutation[j]] = [permutation[j], permutation[i]];
  }

  for (let i = 0; i < 256; i++) {
    p[i] = permutation[i];
    p[256 + i] = permutation[i];
  }
}

export function resizeCanvas(): void {
  const canvas = document.querySelector('canvas');
  if (!canvas || !ctx) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--accent').trim();
  ctx.font = '.75rem monospace';
}   

export function updateNoise(counter: number): void {
  if (!canvas || !ctx) return;

  const width = canvas.width;
  const height = canvas.height;
  
  ctx.clearRect(0, 0, width, height);

  const scale = 0.001; 
  
  for (let y = 0; y < height; y += parseInt(ctx.font.toString()) * 1.25) {
    for (let x = 0; x < width; x += parseInt(ctx.font.toString()) * 1.25) {
      const sampleX = (x + counter * 10) * scale;
      const sampleY = (y) * scale;

      const noiseVal = sampleNoise2D(sampleX, sampleY);

      const luminosity = clamp(Math.floor((noiseVal + 1.22) * 127.5), 0, 200);
      const index = Math.floor(luminosity / 200 * (asciiColorRamp.length - 1));


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


