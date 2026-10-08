type KernelId =
  | 'floyd'
  | 'atkinson'
  | 'jarvis'
  | 'stucki'
  | 'sierra'
  | 'sierra2'
  | 'burkes'
  | 'sierra-lite';

type Algo = 'threshold' | 'random' | 'bayer' | KernelId;

type KernelTap = { dx: number; dy: number; weight: number; label: string };

type Kernel = {
  id: KernelId;
  name: string;
  formula: string;
  note: string;
  taps: KernelTap[];
};

const BAYER_4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

const ERROR_KERNELS: Record<KernelId, Kernel> = {
  floyd: {
    id: 'floyd',
    name: 'Floyd–Steinberg',
    formula: '7/16 · 3/16 · 5/16 · 1/16',
    note: 'Compact 2×2 neighborhood',
    taps: [
      { dx: 1, dy: 0, weight: 7 / 16, label: '7/16' },
      { dx: -1, dy: 1, weight: 3 / 16, label: '3/16' },
      { dx: 0, dy: 1, weight: 5 / 16, label: '5/16' },
      { dx: 1, dy: 1, weight: 1 / 16, label: '1/16' },
    ],
  },
  atkinson: {
    id: 'atkinson',
    name: 'Atkinson',
    formula: '1/8 × 6 · 25% discarded',
    note: 'High contrast · only 75% of error kept',
    taps: [
      { dx: 1, dy: 0, weight: 1 / 8, label: '1/8' },
      { dx: 2, dy: 0, weight: 1 / 8, label: '1/8' },
      { dx: -1, dy: 1, weight: 1 / 8, label: '1/8' },
      { dx: 0, dy: 1, weight: 1 / 8, label: '1/8' },
      { dx: 1, dy: 1, weight: 1 / 8, label: '1/8' },
      { dx: 0, dy: 2, weight: 1 / 8, label: '1/8' },
    ],
  },
  jarvis: {
    id: 'jarvis',
    name: 'Jarvis–Judice–Ninke',
    formula: '48ths over a 5×3 field',
    note: 'Wider kernel · smoother tones',
    taps: [
      { dx: 1, dy: 0, weight: 7 / 48, label: '7' },
      { dx: 2, dy: 0, weight: 5 / 48, label: '5' },
      { dx: -2, dy: 1, weight: 3 / 48, label: '3' },
      { dx: -1, dy: 1, weight: 5 / 48, label: '5' },
      { dx: 0, dy: 1, weight: 7 / 48, label: '7' },
      { dx: 1, dy: 1, weight: 5 / 48, label: '5' },
      { dx: 2, dy: 1, weight: 3 / 48, label: '3' },
      { dx: -2, dy: 2, weight: 1 / 48, label: '1' },
      { dx: -1, dy: 2, weight: 3 / 48, label: '3' },
      { dx: 0, dy: 2, weight: 5 / 48, label: '5' },
      { dx: 1, dy: 2, weight: 3 / 48, label: '3' },
      { dx: 2, dy: 2, weight: 1 / 48, label: '1' },
    ],
  },
  stucki: {
    id: 'stucki',
    name: 'Stucki',
    formula: '42nds over a 5×3 field',
    note: 'Jarvis-like shape · sharper edges',
    taps: [
      { dx: 1, dy: 0, weight: 8 / 42, label: '8' },
      { dx: 2, dy: 0, weight: 4 / 42, label: '4' },
      { dx: -2, dy: 1, weight: 2 / 42, label: '2' },
      { dx: -1, dy: 1, weight: 4 / 42, label: '4' },
      { dx: 0, dy: 1, weight: 8 / 42, label: '8' },
      { dx: 1, dy: 1, weight: 4 / 42, label: '4' },
      { dx: 2, dy: 1, weight: 2 / 42, label: '2' },
      { dx: -2, dy: 2, weight: 1 / 42, label: '1' },
      { dx: -1, dy: 2, weight: 2 / 42, label: '2' },
      { dx: 0, dy: 2, weight: 4 / 42, label: '4' },
      { dx: 1, dy: 2, weight: 2 / 42, label: '2' },
      { dx: 2, dy: 2, weight: 1 / 42, label: '1' },
    ],
  },
  sierra: {
    id: 'sierra',
    name: 'Sierra',
    formula: '32nds · three-row Sierra',
    note: 'Balanced detail and softness',
    taps: [
      { dx: 1, dy: 0, weight: 5 / 32, label: '5' },
      { dx: 2, dy: 0, weight: 3 / 32, label: '3' },
      { dx: -2, dy: 1, weight: 2 / 32, label: '2' },
      { dx: -1, dy: 1, weight: 4 / 32, label: '4' },
      { dx: 0, dy: 1, weight: 5 / 32, label: '5' },
      { dx: 1, dy: 1, weight: 4 / 32, label: '4' },
      { dx: 2, dy: 1, weight: 2 / 32, label: '2' },
      { dx: -1, dy: 2, weight: 2 / 32, label: '2' },
      { dx: 0, dy: 2, weight: 3 / 32, label: '3' },
      { dx: 1, dy: 2, weight: 2 / 32, label: '2' },
    ],
  },
  sierra2: {
    id: 'sierra2',
    name: 'Two-Row Sierra',
    formula: '16ths over two rows',
    note: 'Faster Sierra variant',
    taps: [
      { dx: 1, dy: 0, weight: 4 / 16, label: '4' },
      { dx: 2, dy: 0, weight: 3 / 16, label: '3' },
      { dx: -2, dy: 1, weight: 1 / 16, label: '1' },
      { dx: -1, dy: 1, weight: 2 / 16, label: '2' },
      { dx: 0, dy: 1, weight: 3 / 16, label: '3' },
      { dx: 1, dy: 1, weight: 2 / 16, label: '2' },
      { dx: 2, dy: 1, weight: 1 / 16, label: '1' },
    ],
  },
  burkes: {
    id: 'burkes',
    name: 'Burkes',
    formula: '32nds · two-row Burkes',
    note: 'Stucki-like, without the third row',
    taps: [
      { dx: 1, dy: 0, weight: 8 / 32, label: '8' },
      { dx: 2, dy: 0, weight: 4 / 32, label: '4' },
      { dx: -2, dy: 1, weight: 2 / 32, label: '2' },
      { dx: -1, dy: 1, weight: 4 / 32, label: '4' },
      { dx: 0, dy: 1, weight: 8 / 32, label: '8' },
      { dx: 1, dy: 1, weight: 4 / 32, label: '4' },
      { dx: 2, dy: 1, weight: 2 / 32, label: '2' },
    ],
  },
  'sierra-lite': {
    id: 'sierra-lite',
    name: 'Sierra Lite',
    formula: '2/4 · 1/4 · 1/4',
    note: 'Tiny kernel · very fast',
    taps: [
      { dx: 1, dy: 0, weight: 2 / 4, label: '2/4' },
      { dx: -1, dy: 1, weight: 1 / 4, label: '1/4' },
      { dx: 0, dy: 1, weight: 1 / 4, label: '1/4' },
    ],
  },
};

function clamp(n: number, min = 0, max = 255) {
  return Math.max(min, Math.min(max, n));
}

function luminance(r: number, g: number, b: number) {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

function nearestGray(value: number, levels: number) {
  if (levels <= 2) return value < 128 ? 0 : 255;
  const step = 255 / (levels - 1);
  return Math.round(value / step) * step;
}

type RGB = { r: number; g: number; b: number };

const paletteCache = new WeakMap<ImageData, Map<number, RGB[]>>();

function getPalette(source: ImageData, requestedColors: number): RGB[] {
  const count = Math.max(2, Math.min(256, Math.floor(requestedColors)));
  let sourceCache = paletteCache.get(source);
  if (!sourceCache) {
    sourceCache = new Map();
    paletteCache.set(source, sourceCache);
  }
  const cached = sourceCache.get(count);
  if (cached) return cached;

  const pixels: RGB[] = [];
  // Sampling every eighth pixel keeps palette extraction quick while covering the whole image.
  for (let i = 0; i < source.data.length; i += 32) {
    if (source.data[i + 3] === 0) continue;
    pixels.push({ r: source.data[i], g: source.data[i + 1], b: source.data[i + 2] });
  }
  if (pixels.length === 0) pixels.push({ r: 0, g: 0, b: 0 });

  const buckets: RGB[][] = [pixels];
  while (buckets.length < count) {
    let splitIndex = -1;
    let splitChannel: keyof RGB = 'r';
    let widestRange = -1;

    buckets.forEach((bucket, index) => {
      if (bucket.length < 2) return;
      const min: RGB = { r: 255, g: 255, b: 255 };
      const max: RGB = { r: 0, g: 0, b: 0 };
      bucket.forEach((pixel) => {
        (['r', 'g', 'b'] as const).forEach((channel) => {
          min[channel] = Math.min(min[channel], pixel[channel]);
          max[channel] = Math.max(max[channel], pixel[channel]);
        });
      });
      (['r', 'g', 'b'] as const).forEach((channel) => {
        const range = max[channel] - min[channel];
        if (range > widestRange) {
          widestRange = range;
          splitIndex = index;
          splitChannel = channel;
        }
      });
    });

    if (splitIndex < 0) break;
    const bucket = buckets[splitIndex];
    bucket.sort((a, b) => a[splitChannel] - b[splitChannel]);
    const midpoint = Math.floor(bucket.length / 2);
    if (midpoint === 0 || midpoint === bucket.length) break;
    buckets.splice(splitIndex, 1, bucket.slice(0, midpoint), bucket.slice(midpoint));
  }

  const palette = buckets.map((bucket) => {
    const total = bucket.reduce(
      (sum, pixel) => ({ r: sum.r + pixel.r, g: sum.g + pixel.g, b: sum.b + pixel.b }),
      { r: 0, g: 0, b: 0 },
    );
    return {
      r: Math.round(total.r / bucket.length),
      g: Math.round(total.g / bucket.length),
      b: Math.round(total.b / bucket.length),
    };
  });
  sourceCache.set(count, palette);
  return palette;
}

function nearestColor(r: number, g: number, b: number, palette: RGB[]) {
  let nearest = palette[0];
  let minDistance = Infinity;
  for (const color of palette) {
    const dr = r - color.r;
    const dg = g - color.g;
    const db = b - color.b;
    const distance = dr * dr + dg * dg + db * db;
    if (distance < minDistance) {
      minDistance = distance;
      nearest = color;
    }
  }
  return [nearest.r, nearest.g, nearest.b] as const;
}

export function drawSourcePortrait(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, '#7eb0b8');
  sky.addColorStop(0.42, '#d2bf8a');
  sky.addColorStop(0.72, '#6d8566');
  sky.addColorStop(1, '#243029');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  const sun = ctx.createRadialGradient(w * 0.72, h * 0.28, 0, w * 0.72, h * 0.28, w * 0.28);
  sun.addColorStop(0, 'rgba(255, 224, 160, 0.95)');
  sun.addColorStop(0.45, 'rgba(196, 165, 106, 0.35)');
  sun.addColorStop(1, 'rgba(196, 165, 106, 0)');
  ctx.fillStyle = sun;
  ctx.fillRect(0, 0, w, h);

  const hill = ctx.createRadialGradient(w * 0.35, h * 1.05, w * 0.1, w * 0.4, h * 0.85, w * 0.7);
  hill.addColorStop(0, 'rgba(45, 70, 58, 0.95)');
  hill.addColorStop(1, 'rgba(45, 70, 58, 0)');
  ctx.fillStyle = hill;
  ctx.fillRect(0, 0, w, h);

  const face = ctx.createRadialGradient(w * 0.48, h * 0.46, w * 0.04, w * 0.5, h * 0.5, w * 0.26);
  face.addColorStop(0, 'rgba(236, 214, 176, 0.98)');
  face.addColorStop(0.55, 'rgba(150, 168, 140, 0.55)');
  face.addColorStop(1, 'rgba(30, 40, 34, 0)');
  ctx.fillStyle = face;
  ctx.fillRect(0, 0, w, h);

  const cool = ctx.createRadialGradient(w * 0.18, h * 0.62, 0, w * 0.18, h * 0.62, w * 0.32);
  cool.addColorStop(0, 'rgba(60, 158, 205, 0.42)');
  cool.addColorStop(1, 'rgba(60, 158, 205, 0)');
  ctx.fillStyle = cool;
  ctx.fillRect(0, 0, w, h);

  // Soft horizontal bands so quantization artifacts are obvious without dithering.
  for (let y = 0; y < h; y += 6) {
    const t = y / h;
    ctx.fillStyle = `rgba(20, 22, 18, ${0.03 + t * 0.05})`;
    ctx.fillRect(0, y, w, 2);
  }
}

const DEMO_SOURCE_URL = '/images/test-img.png';

function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  w: number,
  h: number,
) {
  const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
  const dw = img.naturalWidth * scale;
  const dh = img.naturalHeight * scale;
  ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
}

async function createDemoSource(w: number, h: number): Promise<ImageData> {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  try {
    const img = new Image();
    img.decoding = 'async';
    img.src = DEMO_SOURCE_URL;
    await img.decode();
    drawImageCover(ctx, img, w, h);
  } catch {
    drawSourcePortrait(ctx, w, h);
  }
  return ctx.getImageData(0, 0, w, h);
}

export function ditherImageData(
  source: ImageData,
  algo: Algo,
  options: { levels?: number; colors?: number; intensity?: number } = {},
): ImageData {
  const { levels = 2, colors = 2, intensity = 1 } = options;
  const { width: w, height: h } = source;
  const useGray = colors <= 2;
  // Multi-color error diffusion uses median-cut. Two-color stays grayscale so
  // soft gradients don't pick two muddy midtones or split RGB error wrongly.
  const palette =
    algo === 'threshold' || algo === 'random' || algo === 'bayer' || useGray
      ? null
      : getPalette(source, colors);
  const src = new Float32Array(source.data.length);
  for (let i = 0; i < source.data.length; i++) src[i] = source.data[i];
  const out = new ImageData(w, h);
  const data = out.data;

  const setPixel = (i: number, r: number, g: number, b: number, a: number) => {
    data[i] = clamp(r);
    data[i + 1] = clamp(g);
    data[i + 2] = clamp(b);
    data[i + 3] = a;
  };

  const diffuse = (x: number, y: number, er: number, eg: number, eb: number, factor: number) => {
    if (x < 0 || x >= w || y < 0 || y >= h) return;
    const i = (y * w + x) * 4;
    src[i] += er * factor;
    src[i + 1] += eg * factor;
    src[i + 2] += eb * factor;
  };

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      let r = src[i];
      let g = src[i + 1];
      let b = src[i + 2];
      const a = source.data[i + 3];

      if (algo === 'threshold' || algo === 'random' || algo === 'bayer') {
        let threshold = 128;
        if (algo === 'random') threshold = Math.random() * 255;
        if (algo === 'bayer') threshold = ((BAYER_4[y % 4][x % 4] + 0.5) / 16) * 255;
        const gray = luminance(r, g, b);
        if (useGray) {
          const v = gray + (gray - threshold) * (intensity - 1) > threshold ? 255 : 0;
          setPixel(i, v, v, v, a);
        } else {
          const boosted = gray + (threshold - 128) * 0.35 * intensity;
          const v = nearestGray(boosted, levels);
          setPixel(i, v, v, v, a);
        }
        continue;
      }

      const kernel = ERROR_KERNELS[algo as KernelId];
      if (!kernel) continue;

      if (useGray) {
        const gray = luminance(r, g, b);
        const v = gray < 128 ? 0 : 255;
        setPixel(i, v, v, v, a);
        const err = (gray - v) * intensity;
        for (const tap of kernel.taps) {
          diffuse(x + tap.dx, y + tap.dy, err, err, err, tap.weight);
        }
        continue;
      }

      const [nr, ng, nb] = nearestColor(r, g, b, palette!);
      setPixel(i, nr, ng, nb, a);
      const er = (r - nr) * intensity;
      const eg = (g - ng) * intensity;
      const eb = (b - nb) * intensity;
      for (const tap of kernel.taps) {
        diffuse(x + tap.dx, y + tap.dy, er, eg, eb, tap.weight);
      }
    }
  }

  return out;
}

function initCompareSlider(root: HTMLElement) {
  const stage = root.querySelector<HTMLElement>('.dither-compare');
  const before = root.querySelector<HTMLCanvasElement>('[data-canvas="before"]');
  const after = root.querySelector<HTMLCanvasElement>('[data-canvas="after"]');
  const range = root.querySelector<HTMLInputElement>('input[type="range"]');
  const label = root.querySelector<HTMLElement>('[data-algo-label]');
  const chips = root.querySelectorAll<HTMLButtonElement>('[data-algo]');
  if (!stage || !before || !after || !range) return;

  const originalWidth = 1440;
  const originalHeight = 810;
  before.width = originalWidth;
  before.height = originalHeight;

  const ditherWidth = 720;
  const ditherHeight = 405;
  after.width = ditherWidth;
  after.height = ditherHeight;

  const bctx = before.getContext('2d')!;
  const actx = after.getContext('2d')!;

  let algo: Algo = 'floyd';
  let ditherSource: ImageData | null = null;

  const render = () => {
    if (!ditherSource) return;
    actx.putImageData(ditherImageData(ditherSource, algo, { colors: 2, intensity: 1 }), 0, 0);
    if (label) label.textContent = labelMap[algo];
  };

  const applyClip = () => {
    stage.style.setProperty('--split', `${range.value}%`);
  };
  range.addEventListener('input', applyClip);
  applyClip();

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      algo = (chip.dataset.algo as Algo) || 'floyd';
      chips.forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
      render();
    });
  });

  void Promise.all([
    createDemoSource(originalWidth, originalHeight),
    createDemoSource(ditherWidth, ditherHeight),
  ]).then(([originalImage, ditherImage]) => {
    bctx.putImageData(originalImage, 0, 0);
    ditherSource = ditherImage;
    render();
  });
}

const labelMap: Record<Algo, string> = {
  threshold: 'Threshold',
  random: 'Random',
  bayer: 'Bayer (ordered)',
  floyd: 'Floyd–Steinberg',
  atkinson: 'Atkinson',
  jarvis: 'Jarvis–Judice–Ninke',
  stucki: 'Stucki',
  sierra: 'Sierra',
  sierra2: 'Two-Row Sierra',
  burkes: 'Burkes',
  'sierra-lite': 'Sierra Lite',
};

function initOrderedDemo(root: HTMLElement) {
  const none = root.querySelector<HTMLCanvasElement>('[data-canvas="none"]');
  const bayer = root.querySelector<HTMLCanvasElement>('[data-canvas="bayer"]');
  const steps = root.querySelectorAll<HTMLButtonElement>('[data-colors]');
  const meters = root.querySelectorAll<HTMLElement>('[data-color-step]');
  if (!none || !bayer) return;

  const w = 180;
  const h = 120;
  none.width = bayer.width = w;
  none.height = bayer.height = h;
  const nctx = none.getContext('2d')!;
  const bctx = bayer.getContext('2d')!;

  let colors = 4;
  let source: ImageData | null = null;

  const render = () => {
    if (!source) return;
    // fake "no dithering" by nearest color without diffusion/pattern
    const palette = getPalette(source, colors);
    const flat = new ImageData(w, h);
    for (let i = 0; i < source.data.length; i += 4) {
      const [r, g, b] = nearestColor(source.data[i], source.data[i + 1], source.data[i + 2], palette);
      flat.data[i] = r;
      flat.data[i + 1] = g;
      flat.data[i + 2] = b;
      flat.data[i + 3] = 255;
    }
    nctx.putImageData(flat, 0, 0);
    bctx.putImageData(ditherImageData(source, 'bayer', { colors, levels: colors }), 0, 0);
    meters.forEach((m) => {
      m.classList.toggle('is-active', Number(m.dataset.colorStep) === colors);
    });
  };

  steps.forEach((btn) => {
    btn.addEventListener('click', () => {
      colors = Number(btn.dataset.colors) || 4;
      steps.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      render();
    });
  });

  void createDemoSource(w, h).then((image) => {
    source = image;
    render();
  });
}

function renderKernelDiagram(container: HTMLElement, kernel: Kernel) {
  const xs = kernel.taps.map((t) => t.dx);
  const ys = kernel.taps.map((t) => t.dy);
  const minX = Math.min(0, ...xs);
  const maxX = Math.max(0, ...xs);
  const minY = Math.min(0, ...ys);
  const maxY = Math.max(0, ...ys);
  const cols = maxX - minX + 1;
  const rows = maxY - minY + 1;
  const maxW = Math.max(...kernel.taps.map((t) => t.weight));

  container.style.setProperty('--kernel-cols', String(cols));
  container.style.setProperty('--kernel-rows', String(rows));
  container.replaceChildren();

  const tapAt = (dx: number, dy: number) => kernel.taps.find((t) => t.dx === dx && t.dy === dy);

  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const cell = document.createElement('span');
      cell.className = 'dither-pixel';
      if (x === 0 && y === 0) {
        cell.classList.add('dither-pixel--current');
        cell.dataset.role = 'origin';
        cell.textContent = 'X';
      } else {
        const tap = tapAt(x, y);
        if (tap) {
          cell.dataset.role = 'tap';
          cell.dataset.dx = String(tap.dx);
          cell.dataset.dy = String(tap.dy);
          cell.textContent = tap.label;
          if (tap.weight >= maxW * 0.75) cell.classList.add('dither-pixel--strong');
          else if (tap.weight >= maxW * 0.4) cell.classList.add('dither-pixel--mid');
        } else {
          cell.classList.add('dither-pixel--empty');
          cell.textContent = '';
        }
      }
      container.appendChild(cell);
    }
  }
}

function initErrorAnim(root: HTMLElement) {
  const canvas = root.querySelector<HTMLCanvasElement>('canvas');
  const playBtn = root.querySelector<HTMLButtonElement>('[data-play]');
  const status = root.querySelector<HTMLElement>('[data-status]');
  const diagram = root.querySelector<HTMLElement>('[data-kernel-diagram]');
  const nameEl = root.querySelector<HTMLElement>('[data-kernel-name]');
  const formulaEl = root.querySelector<HTMLElement>('[data-kernel-formula]');
  const noteEl = root.querySelector<HTMLElement>('[data-kernel-note]');
  const flowEl = root.querySelector<HTMLElement>('[data-kernel-flow]');
  const chips = root.querySelectorAll<HTMLButtonElement>('[data-kernel]');
  if (!canvas || !diagram) return;

  const cell = 16;
  const cols = 16;
  const rows = 11;
  canvas.width = cols * cell;
  canvas.height = rows * cell;
  const ctx = canvas.getContext('2d')!;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const field = new Float32Array(cols * rows);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      field[y * cols + x] = 40 + (x / cols) * 140 + Math.sin(y * 0.55) * 28 + ((x + y) % 5) * 4;
    }
  }
  const work = Float32Array.from(field);
  const done = new Uint8Array(cols * rows);
  let i = 0;
  let raf = 0;
  let playing = true;
  let inView = true;
  let kernel = ERROR_KERNELS.floyd;
  let pulseTimer = 0;

  const paint = (cursor = -1, err = 0) => {
    ctx.fillStyle = '#1b241f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const idx = y * cols + x;
        if (done[idx]) {
          ctx.fillStyle = work[idx] >= 128 ? '#e8e3d6' : '#243029';
        } else {
          const g = clamp(work[idx]);
          ctx.fillStyle = `rgb(${g},${g},${Math.round(g * 0.92)})`;
        }
        ctx.fillRect(x * cell, y * cell, cell - 1, cell - 1);
      }
    }

    if (cursor < 0) return;
    const cx = cursor % cols;
    const cy = (cursor / cols) | 0;

    // Show where this step's error is landing.
    for (const tap of kernel.taps) {
      const xx = cx + tap.dx;
      const yy = cy + tap.dy;
      if (xx < 0 || xx >= cols || yy < 0 || yy >= rows) continue;
      const alpha = 0.22 + tap.weight * 0.7;
      ctx.fillStyle = `rgba(60, 158, 205, ${alpha})`;
      ctx.fillRect(xx * cell, yy * cell, cell - 1, cell - 1);
      ctx.strokeStyle = 'rgba(227, 199, 143, 0.95)';
      ctx.lineWidth = 1;
      ctx.strokeRect(xx * cell + 0.5, yy * cell + 0.5, cell - 2, cell - 2);

      // Direction tick from X toward the neighbor.
      const x0 = cx * cell + cell / 2;
      const y0 = cy * cell + cell / 2;
      const x1 = xx * cell + cell / 2;
      const y1 = yy * cell + cell / 2;
      ctx.strokeStyle = `rgba(227, 199, 143, ${0.35 + tap.weight})`;
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.stroke();
    }

    ctx.fillStyle = '#3c9ecd';
    ctx.fillRect(cx * cell, cy * cell, cell - 1, cell - 1);
    ctx.strokeStyle = '#e8e3d6';
    ctx.lineWidth = 2;
    ctx.strokeRect(cx * cell + 0.5, cy * cell + 0.5, cell - 2, cell - 2);

    if (err !== 0) {
      ctx.fillStyle = '#141612';
      ctx.font = 'bold 9px Iosevka, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(err > 0 ? '+' : '−', cx * cell + cell / 2, cy * cell + cell / 2);
    }
  };

  const pulseDiagram = (active: boolean) => {
    diagram.querySelectorAll('[data-role="tap"], [data-role="origin"]').forEach((node) => {
      node.classList.toggle('is-firing', active);
    });
  };

  const diffuse = (x: number, y: number, err: number) => {
    for (const tap of kernel.taps) {
      const xx = x + tap.dx;
      const yy = y + tap.dy;
      if (xx < 0 || xx >= cols || yy < 0 || yy >= rows) continue;
      work[yy * cols + xx] += err * tap.weight;
    }
  };

  const describeFlow = (err: number) => {
    if (!flowEl) return;
    if (err === 0) {
      flowEl.textContent = 'Exact match — nothing to spread';
      return;
    }
    const parts = kernel.taps
      .slice(0, 4)
      .map((tap) => `${tap.label} → ${(err * tap.weight).toFixed(0)}`);
    const more = kernel.taps.length > 4 ? ` · +${kernel.taps.length - 4} more` : '';
    flowEl.textContent = `Error ${err.toFixed(0)} splits: ${parts.join(' · ')}${more}`;
  };

  const runToEnd = () => {
    while (i < cols * rows) {
      const x = i % cols;
      const y = (i / cols) | 0;
      const old = work[i];
      const neu = old < 128 ? 0 : 255;
      work[i] = neu;
      done[i] = 1;
      diffuse(x, y, old - neu);
      i += 1;
    }
    paint();
    pulseDiagram(false);
    playing = false;
    if (status) status.textContent = `${kernel.name} · pass complete`;
    if (flowEl) flowEl.textContent = 'Pass complete — leftover error became texture';
    if (playBtn) playBtn.textContent = 'Replay';
  };

  const step = () => {
    if (i >= cols * rows) {
      playing = false;
      pulseDiagram(false);
      if (status) status.textContent = `${kernel.name} · pass complete`;
      if (flowEl) flowEl.textContent = 'Pass complete — leftover error became texture';
      if (playBtn) playBtn.textContent = 'Replay';
      paint();
      return;
    }
    const x = i % cols;
    const y = (i / cols) | 0;
    const old = work[i];
    const neu = old < 128 ? 0 : 255;
    work[i] = neu;
    done[i] = 1;
    const err = old - neu;
    diffuse(x, y, err);
    describeFlow(err);
    if (status) status.textContent = `${kernel.name} · pixel ${i + 1}/${cols * rows}`;
    paint(i, err);
    pulseDiagram(true);
    window.clearTimeout(pulseTimer);
    pulseTimer = window.setTimeout(() => pulseDiagram(false), 120);
    i += 1;
    if (playing && inView) raf = window.setTimeout(step, 55);
  };

  const reset = (animate = !reduce) => {
    window.clearTimeout(raf);
    window.clearTimeout(pulseTimer);
    work.set(field);
    done.fill(0);
    i = 0;
    pulseDiagram(false);
    if (flowEl) flowEl.textContent = 'Watch blue neighbors receive the leftover error';
    if (animate) {
      playing = true;
      if (playBtn) playBtn.textContent = 'Pause';
      step();
    } else {
      runToEnd();
    }
  };

  const applyKernel = (id: KernelId) => {
    kernel = ERROR_KERNELS[id] ?? ERROR_KERNELS.floyd;
    renderKernelDiagram(diagram, kernel);
    if (nameEl) nameEl.textContent = kernel.name;
    if (formulaEl) formulaEl.innerHTML = `<code>${kernel.formula}</code>`;
    if (noteEl) noteEl.textContent = kernel.note;
    canvas.setAttribute('aria-label', `Animated ${kernel.name} error diffusion`);
    chips.forEach((chip) => chip.setAttribute('aria-pressed', String(chip.dataset.kernel === kernel.id)));
    reset(!reduce);
  };

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      applyKernel((chip.dataset.kernel as KernelId) || 'floyd');
    });
  });

  playBtn?.addEventListener('click', () => {
    if (i >= cols * rows) {
      reset(true);
      return;
    }
    playing = !playing;
    if (playBtn) playBtn.textContent = playing ? 'Pause' : 'Resume';
    if (playing) step();
    else window.clearTimeout(raf);
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = Boolean(entry?.isIntersecting);
        if (inView && playing && i < cols * rows) {
          window.clearTimeout(raf);
          step();
        } else if (!inView) {
          window.clearTimeout(raf);
        }
      },
      { rootMargin: '100px 0px' },
    );
    observer.observe(root);
  }

  applyKernel('floyd');
}

function initPair(root: HTMLElement) {
  const floyd = root.querySelector<HTMLCanvasElement>('[data-canvas="floyd"]');
  const atkinson = root.querySelector<HTMLCanvasElement>('[data-canvas="atkinson"]');
  if (!floyd || !atkinson) return;
  const w = 160;
  const h = 160;
  floyd.width = atkinson.width = w;
  floyd.height = atkinson.height = h;

  void createDemoSource(w, h).then((source) => {
    floyd.getContext('2d')!.putImageData(ditherImageData(source, 'floyd', { colors: 2 }), 0, 0);
    atkinson.getContext('2d')!.putImageData(ditherImageData(source, 'atkinson', { colors: 2 }), 0, 0);
  });
}

function initScales(root: HTMLElement) {
  const canvases = [...root.querySelectorAll<HTMLCanvasElement>('canvas[data-scale]')];
  if (!canvases.length) return;

  // Shared dither grid. Must divide evenly by zoom levels 1 / 2 / 4.
  const GRID = 128;
  const base = document.createElement('canvas');
  base.width = GRID;
  base.height = GRID;
  const bctx = base.getContext('2d', { willReadFrequently: true })!;
  const glow = bctx.createRadialGradient(
    GRID * 0.5,
    GRID * 0.42,
    GRID * 0.05,
    GRID * 0.5,
    GRID * 0.5,
    GRID * 0.55,
  );
  glow.addColorStop(0, '#f0e2c0');
  glow.addColorStop(0.45, '#8fa38a');
  glow.addColorStop(1, '#1a211c');
  bctx.fillStyle = glow;
  bctx.fillRect(0, 0, GRID, GRID);
  const ramp = bctx.createLinearGradient(0, 0, 0, GRID);
  ramp.addColorStop(0, 'rgba(255,255,255,0.18)');
  ramp.addColorStop(1, 'rgba(0,0,0,0.28)');
  bctx.fillStyle = ramp;
  bctx.fillRect(0, 0, GRID, GRID);

  const dithered = ditherImageData(bctx.getImageData(0, 0, GRID, GRID), 'bayer', { colors: 2 });
  const tmp = document.createElement('canvas');
  tmp.width = GRID;
  tmp.height = GRID;
  tmp.getContext('2d')!.putImageData(dithered, 0, 0);

  const paint = () => {
    canvases.forEach((canvas) => {
      const zoom = Number(canvas.dataset.scale) || 1;
      const cssSize = Math.max(
        1,
        Math.round(canvas.clientWidth || canvas.getBoundingClientRect().width || 240),
      );
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const out = Math.max(1, Math.round(cssSize * dpr));

      canvas.width = out;
      canvas.height = out;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#1a211c';
      ctx.fillRect(0, 0, out, out);

      // Far view: full pattern with smoothing so pixels optically blend.
      if (zoom <= 1) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(tmp, 0, 0, GRID, GRID, 0, 0, out, out);
        return;
      }

      // Near/mid: integer cell size so every dither pixel is the same sharp block.
      const cells = Math.max(8, Math.round(GRID / zoom));
      const cellPx = Math.max(1, Math.floor(out / cells));
      const drawn = cellPx * cells;
      const sx = Math.floor((GRID - cells) / 2);
      const ox = Math.floor((out - drawn) / 2);

      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(tmp, sx, sx, cells, cells, ox, ox, drawn, drawn);
    });
  };

  paint();
  const ro = new ResizeObserver(() => {
    window.requestAnimationFrame(paint);
  });
  ro.observe(root);
  canvases.forEach((canvas) => ro.observe(canvas));
}

function syncSliderFill(input: HTMLInputElement) {
  const min = Number(input.min || 0);
  const max = Number(input.max || 100);
  const value = Number(input.value);
  const pct = max === min ? 0 : ((value - min) / (max - min)) * 100;
  const shell = input.closest('.dither-slider') as HTMLElement | null;
  (shell ?? input).style.setProperty('--pct', `${pct}%`);
}

function initLab(root: HTMLElement) {
  const canvas = root.querySelector<HTMLCanvasElement>('canvas');
  const algoSelect = root.querySelector<HTMLSelectElement>('[name="algo"]');
  const colorsRange = root.querySelector<HTMLInputElement>('[name="colors"]');
  const intensityRange = root.querySelector<HTMLInputElement>('[name="intensity"]');
  const colorsOut = root.querySelector<HTMLElement>('[data-out="colors"]');
  const intensityOut = root.querySelector<HTMLElement>('[data-out="intensity"]');
  if (!canvas || !algoSelect || !colorsRange || !intensityRange) return;

  canvas.width = 280;
  canvas.height = 200;
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  let source: ImageData | null = null;

  const render = () => {
    if (!source) return;
    const algo = algoSelect.value as Algo;
    const colors = Number(colorsRange.value);
    const intensity = Number(intensityRange.value);
    if (colorsOut) colorsOut.textContent = String(colors);
    if (intensityOut) intensityOut.textContent = intensity.toFixed(2);
    syncSliderFill(colorsRange);
    syncSliderFill(intensityRange);
    ctx.putImageData(
      ditherImageData(source, algo, { colors, levels: colors, intensity }),
      0,
      0,
    );
  };

  algoSelect.addEventListener('change', render);
  colorsRange.addEventListener('input', render);
  intensityRange.addEventListener('input', render);

  void createDemoSource(canvas.width, canvas.height).then((image) => {
    source = image;
    render();
  });
}

function initTimeline(root: HTMLElement) {
  const buttons = root.querySelectorAll<HTMLButtonElement>('[data-year]');
  const panel = root.querySelector<HTMLElement>('[data-timeline-panel]');
  if (!panel) return;
  const copy: Record<string, string> = {
    '1940s': 'Vibration in wartime mechanical computers reduced stick-slip friction — an early physical “dither.”',
    '1961': 'Lawrence Roberts adds pseudorandom noise to quantized TV images in his MIT thesis.',
    '1973': 'Bryce Bayer publishes ordered dithering with a repeating threshold matrix.',
    '1976': 'Floyd & Steinberg diffuse quantization error to neighbors — soft, organic texture.',
    '1984': 'Bill Atkinson’s Macintosh dither keeps high contrast by discarding 25% of the error.',
    '2018+': 'Dither returns as style: Obra Dinn, ditherpunk, and tools like Dither Yuki.',
  };
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      buttons.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      const year = btn.dataset.year || '1976';
      panel.textContent = copy[year] || '';
    });
  });
}

export function initDitherDemos() {
  document.querySelectorAll<HTMLElement>('[data-demo="compare"]').forEach(initCompareSlider);
  document.querySelectorAll<HTMLElement>('[data-demo="ordered"]').forEach(initOrderedDemo);
  document.querySelectorAll<HTMLElement>('[data-demo="error"]').forEach(initErrorAnim);
  document.querySelectorAll<HTMLElement>('[data-demo="pair"]').forEach(initPair);
  document.querySelectorAll<HTMLElement>('[data-demo="scales"]').forEach(initScales);
  document.querySelectorAll<HTMLElement>('[data-demo="lab"]').forEach(initLab);
  document.querySelectorAll<HTMLElement>('[data-demo="timeline"]').forEach(initTimeline);
}

initDitherDemos();
