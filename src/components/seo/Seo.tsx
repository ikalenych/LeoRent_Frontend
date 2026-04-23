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

      <meta key="description" name="description" content={description} />
      <meta
        key="robots"
        name="robots"
        content={noIndex ? "noindex,nofollow" : "index,follow"}
      />

      {canonical && <link key="canonical" rel="canonical" href={canonical} />}

      {canonical && (
        <link
          key="alternate-uk"
          rel="alternate"
          hrefLang="uk-UA"
          href={canonical}
        />
      )}

      {canonical && (
        <link
          key="alternate-default"
          rel="alternate"
          hrefLang="x-default"
          href={canonical}
        />
      )}

      <meta key="og:locale" property="og:locale" content="uk_UA" />
      <meta key="og:type" property="og:type" content="website" />
      <meta key="og:title" property="og:title" content={title} />
      <meta
        key="og:description"
        property="og:description"
        content={description}
      />
      {canonical && <meta key="og:url" property="og:url" content={canonical} />}
      {image && <meta key="og:image" property="og:image" content={image} />}

      <meta
        key="twitter:card"
        name="twitter:card"
        content="summary_large_image"
      />
      <meta key="twitter:title" name="twitter:title" content={title} />
      <meta
        key="twitter:description"
        name="twitter:description"
        content={description}
      />
      {image && (
        <meta key="twitter:image" name="twitter:image" content={image} />
      )}
    </Helmet>
  );
}
