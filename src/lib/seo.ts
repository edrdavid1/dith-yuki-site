type Crumb = {
  name: string;
  path: string;
};

type SchemaNode = {
  '@type': string;
  [key: string]: unknown;
};

export const SITE_NAME = 'Dither Yuki';
export const ORG_NAME = 'Vasdas';
export const ORG_NAME_MARK = 'Vasdas Studio';
export const ORG_URL = 'https://vasdas.studio';
export const DEFAULT_IMAGE_ALT =
  'Dither Yuki — dithered classical painting with the Yuki mascot, by Vasdas Studio';

/** Absolute OG/Twitter/Telegram share image path (1200×630 JPEG). */
export const SOCIAL_CARD_PATH = '/images/social-card.jpg';
export const SOCIAL_CARD_WIDTH = 1200;
export const SOCIAL_CARD_HEIGHT = 630;
export const SOCIAL_CARD_TYPE = 'image/jpeg';

/** Core topical terms for meta keywords + schema.keywords */
export const DITHERING_KEYWORDS = [
  'dithering',
  'image dithering',
  'dither',
  'dithered art',
  'ordered dithering',
  'error diffusion',
  'error-diffusion dithering',
  'Floyd-Steinberg',
  'Floyd–Steinberg dithering',
  'Atkinson dithering',
  'Bayer dithering',
  'Bayer matrix',
  'Jarvis Judice Ninke',
  'Stucki dithering',
  'Sierra dithering',
  'Two-Row Sierra',
  'Sierra Lite',
  'Burkes dithering',
  'Riemersma dithering',
  'threshold dithering',
  'random dithering',
  'blue noise dithering',
  'halftone',
  'halftone dithering',
  'stipple',
  'stippling',
  'ASCII art',
  'ASCII image conversion',
  'ditherpunk',
  'pixel art',
  'color quantization',
  'palette quantization',
  'indexed color',
  'limited palette',
  'color palette generator',
  'CRT effect',
  'glitch art',
  'image processing',
  'graphics application',
  'Dither Yuki',
  'Vasdas',
  'Vasdas Studio',
  'macOS dithering app',
  'Windows dithering software',
].join(', ');

export const DEFAULT_SITE_DESCRIPTION =
  'Dither Yuki is a desktop image dithering and ASCII art studio by Vasdas Studio. Use Floyd–Steinberg, Atkinson, Bayer, Jarvis, Stucki, Sierra, Burkes, Riemersma, halftone, stipple, CRT, and palette tools on macOS and Windows.';

export function originOf(site: URL | undefined) {
  return site ?? new URL('https://ditheryuki.com');
}

export function organizationSchema(site: URL | undefined): SchemaNode {
  const origin = originOf(site);
  return {
    '@type': 'Organization',
    name: ORG_NAME,
    alternateName: [ORG_NAME_MARK, 'Vasdas Studio'],
    description:
      'Vasdas Studio is an independent software studio based in Lithuania, Europe. We create software for creative work, digital exploration and new ways of working with visual media.',
    url: ORG_URL,
    logo: new URL('/android-chrome-512.png', origin).href,
    image: new URL(SOCIAL_CARD_PATH, origin).href,
    sameAs: [ORG_URL, 'https://github.com/edrdavid1/dith-yuki'],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'LT',
      addressRegion: 'Europe',
    },
  };
}

export function breadcrumbSchema(site: URL | undefined, crumbs: Crumb[]) {
  const origin = originOf(site);
  return {
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: new URL(crumb.path, origin).href,
    })),
  };
}

export function softwareApplicationSchema(
  site: URL | undefined,
  description: string,
): SchemaNode {
  const origin = originOf(site);
  const org = organizationSchema(site);
  return {
    '@type': 'SoftwareApplication',
    name: SITE_NAME,
    alternateName: ['Dith Yuki', 'DitherYuki'],
    applicationCategory: 'GraphicsApplication',
    applicationSubCategory: 'Image dithering and ASCII art',
    operatingSystem: 'macOS, Windows',
    description,
    keywords: DITHERING_KEYWORDS,
    featureList: [
      'Ordered dithering with Bayer matrices',
      'Error-diffusion dithering: Floyd–Steinberg, Atkinson, Jarvis–Judice–Ninke, Stucki, Sierra, Burkes, Riemersma',
      'Halftone, stipple, CRT, glitch, and experimental patterns',
      'ASCII art image conversion and export',
      'Color Lab: palette creation, quantization, harmonies, and ramps',
      'Non-destructive layers with opacity and blend modes',
      'Export PNG, JPG, WEBP, BMP, TIFF, SVG, and ASCII formats',
    ],
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    author: org,
    creator: org,
    publisher: org,
    url: origin.href,
    image: new URL(SOCIAL_CARD_PATH, origin).href,
    screenshot: new URL(SOCIAL_CARD_PATH, origin).href,
    downloadUrl: 'https://github.com/edrdavid1/dith-yuki/releases',
    softwareVersion: '1.0.5-beta',
  };
}
