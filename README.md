# Dither Yuki

Статический сайт-визитка для desktop-инструмента dithering на Astro + Tailwind CSS (v4), подготовленный для Cloudflare Pages. Изображения в `public/images/` — локальные ассеты проекта. Страница `/review/` описывает возможности, ограничения и планы развития продукта; `/license/` — отдельная страница лицензирования.

Hero занимает всю ширину и высоту первого экрана; навигация липкая сразу под hero. Дальше — editorial-поток по Figma (`What is it` → `FROM ARTISTS TO ARTISTS` + car → tools → maker), с download CTA и адаптивной вёрсткой.

## Запуск

Требуется Node.js 22.12 или новее (требование Astro 7).

```sh
npm install
npm run dev
```

## Проверка и сборка

```sh
npm run check
npm run build
npm run preview
```

Сборка создаёт статические файлы в `dist/`. Клиентский JavaScript для этой страницы не нужен.

## Публикация на Cloudflare Pages

1. Подключите репозиторий [edrdavid1/dith-yuki-site](https://github.com/edrdavid1/dith-yuki-site) в Cloudflare Pages.
2. Укажите команду сборки `npm run build` и каталог результата `dist` (это также указано в `wrangler.toml`, проект `dith-yuki-site`).
3. Canonical / sitemap / robots по умолчанию используют `https://dith-yuki-site.pages.dev`. При кастомном домене задайте переменную окружения `SITE=https://your.domain` в Cloudflare Pages (Production). На preview-сборках подхватывается `CF_PAGES_URL`.
4. Файлы `public/_headers` и `public/_redirects` применяются Cloudflare Pages автоматически.

## SEO и контент

- `src/components/SEO.astro` — title, description, canonical, favicons, Open Graph, Twitter Cards, WebSite JSON-LD.
- `src/pages/index.astro` добавляет `SoftwareApplication` JSON-LD.
- Социальная карточка: `public/social-card.png` (1200×630).
- `@astrojs/sitemap` и `src/pages/robots.txt.ts` генерируют sitemap и robots при сборке.
