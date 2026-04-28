// @ts-nocheck
import { Context } from "https://edge.netlify.com";

const API_URL = "https://leorent-backend.onrender.com";

const BOT_REGEX =
  /facebookexternalhit|twitterbot|telegrambot|linkedinbot|googlebot|whatsapp|vkshare|slackbot|discordbot/i;

export default async (request: Request, context: Context) => {
  const url = new URL(request.url);
  const userAgent = request.headers.get("user-agent") || "";

  const isBot = BOT_REGEX.test(userAgent);
  const match = url.pathname.match(/^\/listings\/([^/]+)$/);

  if (!isBot || !match) return context.next();

  const id = match[1];

  try {
    const res = await fetch(`${API_URL}/apartment/${id}`);
    if (!res.ok) return context.next();

    const apt = await res.json();

    const title = apt.title ? `${apt.title} — LeoRent` : "Оголошення — LeoRent";
    const description = apt.description
      ? apt.description.slice(0, 160)
      : `${apt.rooms} кімн., ${apt.square} м², ${apt.location}. Оренда на LeoRent.`;
    const image =
      apt.pictures?.find((p) => p.metadata?.format === "png")?.url ||
      "https://leorent.netlify.app/og-image.jpg";
    const canonical = `https://leorent.netlify.app/listings/${id}`;

    const html = `<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="UTF-8" />
  <title>${title}</title>
  <meta name="description" content="${description}" />
  <meta property="og:type" content="website" />
  <meta property="og:locale" content="uk_UA" />
  <meta property="og:site_name" content="LeoRent" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:image" content="${image}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${image}" />
  <link rel="canonical" href="${canonical}" />
</head>
<body></body>
</html>`;

    return new Response(html, {
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  } catch {
    return context.next();
  }
};

export const config = { path: "/listings/*" };
