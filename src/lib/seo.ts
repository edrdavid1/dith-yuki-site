type Crumb = {
  name: string;
  path: string;
};

export function breadcrumbSchema(site: URL | undefined, crumbs: Crumb[]) {
  const origin = site ?? new URL('https://ditheryuki.com');
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
