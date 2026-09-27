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

1. Подключите репозиторий [edrdavid1/dith-yuki-site](https://github.com/edrdavid1/dith-yuki-site) в **Cloudflare Pages** (не Workers).
2. Настройки сборки:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Deploy command:** оставьте **пустым**
3. Не указывайте `npx wrangler deploy` — это команда для Workers и ломает Pages-деплой (`Missing entry-point to Worker script`).
4. Canonical / sitemap / robots по умолчанию используют `https://ditheryuki.com`. Если основной домен когда-либо изменится, задайте `SITE=https://your.domain` в Cloudflare Pages environment variables для Production. Preview builds тоже намеренно указывают canonical на основной домен.
5. `public/_headers` и `public/_redirects` применяются автоматически.

Ручной деплой с машины: `npm run pages:deploy` (нужен `wrangler` login / API token).

## SEO и контент

- `src/components/SEO.astro` — title, description, canonical, favicons, Open Graph, Twitter Cards, WebSite JSON-LD.
- `src/pages/index.astro` добавляет `SoftwareApplication` JSON-LD.
- Социальная карточка: `public/social-card.png` (1200×630).
- `@astrojs/sitemap` и `src/pages/robots.txt.ts` генерируют sitemap и robots при сборке.
- После Production-деплоя добавьте в Google Search Console свойство типа **Domain** для `ditheryuki.com`, подтвердите владение DNS TXT-записью у регистратора / DNS-провайдера и отправьте `https://ditheryuki.com/sitemap-index.xml`. После этого запросите проверку главной, `/review/` и `/license/`; индексация зависит от решения поисковика и не происходит мгновенно.
- Bing принимает тот же стандартный XML sitemap — отдельный файл или специальный Bing-формат не нужны. После Production-деплоя добавьте и подтвердите сайт в [Bing Webmaster Tools](https://www.bing.com/webmasters/), затем отправьте `https://ditheryuki.com/sitemap-index.xml`; ссылка Sitemap в `robots.txt` уже доступна и для Bingbot.
