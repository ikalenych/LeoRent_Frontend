import { Helmet } from "react-helmet-async";

interface SeoProps {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  noIndex?: boolean;
}

export function Seo({
  title,
  description,
  canonical,
  image,
  noIndex = false,
}: SeoProps) {
  return (
    <Helmet prioritizeSeoTags>
      <html lang="uk" />
      <title>{title}</title>

      <meta name="description" content={description} />
      <meta
        name="robots"
        content={noIndex ? "noindex,nofollow" : "index,follow"}
      />

      {canonical && <link rel="canonical" href={canonical} />}

      {/* LANG ALTERNATES */}
      {canonical && <link rel="alternate" hrefLang="uk-UA" href={canonical} />}
      {canonical && (
        <link rel="alternate" hrefLang="x-default" href={canonical} />
      )}

      <meta property="og:locale" content="uk_UA" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />

      {canonical && <meta property="og:url" content={canonical} />}

      <meta
        property="og:image"
        content={image || "https://leorent.netlify.app/default.jpg"}
      />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta
        name="twitter:image"
        content={image || "https://leorent.netlify.app/default.jpg"}
      />
    </Helmet>
  );
}
