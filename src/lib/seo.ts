type Crumb = {
  name: string;
  path: string;
};

type SchemaNode = {
  '@type': string;
  [key: string]: unknown;
};

export const SITE_NAME = 'Dither Yuki';
export const ORG_NAME = "L'eco non di Bergamo";
export const ORG_NAME_MARK = "L'eco non di Bergamo.¹";
export const PERSON_NAME = 'David Murashka';
export const PERSON_ALIAS = 'Dave';
export const DEFAULT_IMAGE_ALT =
  'Dither Yuki — desktop image dithering and ASCII art studio by David Murashka / L\'eco non di Bergamo';

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
  'David Murashka',
  "L'eco non di Bergamo",
  "L'eco non di Bergamo.¹",
  'macOS dithering app',
  'Windows dithering software',
].join(', ');

export const DEFAULT_SITE_DESCRIPTION =
  'Dither Yuki is a desktop image dithering and ASCII art studio by David Murashka / L\'eco non di Bergamo.¹ Use Floyd–Steinberg, Atkinson, Bayer, Jarvis, Stucki, Sierra, Burkes, Riemersma, halftone, stipple, CRT, and palette tools on macOS and Windows.';

export function originOf(site: URL | undefined) {
  return site ?? new URL('https://ditheryuki.com');
}

export function personSchema(): SchemaNode {
  return {
    '@type': 'Person',
    name: PERSON_NAME,
    alternateName: [PERSON_ALIAS, ORG_NAME, ORG_NAME_MARK],
    jobTitle: 'Artist and indie developer',
    url: 'https://ditheryuki.com/',
    sameAs: [
      'https://github.com/edrdavid1/dith-yuki',
      'https://t.me/leco_di_Bergamo',
    ],
    worksFor: {
      '@type': 'Organization',
      name: ORG_NAME,
    },
  };
}

export function organizationSchema(site: URL | undefined): SchemaNode {
  const origin = originOf(site);
  return {
    '@type': 'Organization',
    name: ORG_NAME,
    alternateName: [ORG_NAME_MARK, 'Leco non di Bergamo'],
    url: origin.href,
    logo: new URL('/android-chrome-512.png', origin).href,
    founder: {
      '@type': 'Person',
      name: PERSON_NAME,
      alternateName: PERSON_ALIAS,
    },
    sameAs: [
      'https://github.com/edrdavid1/dith-yuki',
      'https://t.me/leco_di_Bergamo',
    ],
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
    author: personSchema(),
    creator: personSchema(),
    publisher: organizationSchema(site),
    url: origin.href,
    downloadUrl: 'https://github.com/edrdavid1/dith-yuki/releases',
    softwareVersion: '1.0.5-beta',
  };
}
