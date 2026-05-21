import { useEffect } from "react";
import { siteConfig } from "../../data/siteConfig";
import { absoluteImageUrl, absoluteUrl, pageSchema } from "../../seo/schema";

type JsonLdInput = unknown;

type SEOProps = {
  title: string;
  description: string;
  canonicalPath?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  jsonLd?: JsonLdInput;
};

export function SEO({
  title,
  description,
  canonicalPath,
  ogTitle,
  ogDescription,
  ogImage = siteConfig.defaultOgImage,
  jsonLd,
}: SEOProps) {
  useEffect(() => {
    const path =
      canonicalPath ??
      (typeof window !== "undefined" ? window.location.pathname : "/");
    const canonicalUrl = absoluteUrl(path);
    const imageUrl = absoluteImageUrl(ogImage);

    document.title = title;

    setMeta("name", "description", description);
    setMeta("property", "og:type", "website");
    setMeta("property", "og:site_name", siteConfig.platformName);
    setMeta("property", "og:title", ogTitle ?? title);
    setMeta("property", "og:description", ogDescription ?? description);
    setMeta("property", "og:url", canonicalUrl);
    setMeta("property", "og:image", imageUrl);
    setMeta("property", "og:locale", "es_PA");
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", ogTitle ?? title);
    setMeta("name", "twitter:description", ogDescription ?? description);
    setMeta("name", "twitter:image", imageUrl);
    setMeta("name", "robots", "index,follow");
    setCanonical(canonicalUrl);
    setJsonLd(jsonLd ?? pageSchema());
  }, [
    canonicalPath,
    description,
    jsonLd,
    ogDescription,
    ogImage,
    ogTitle,
    title,
  ]);

  return null;
}

function setMeta(attribute: "name" | "property", key: string, content: string) {
  const selector = `meta[${attribute}="${key}"]`;
  const meta =
    document.querySelector<HTMLMetaElement>(selector) ??
    document.createElement("meta");

  meta.setAttribute(attribute, key);
  meta.content = content;

  if (!meta.parentElement) {
    document.head.appendChild(meta);
  }
}

function setCanonical(href: string) {
  const canonical =
    document.querySelector<HTMLLinkElement>('link[rel="canonical"]') ??
    document.createElement("link");

  canonical.rel = "canonical";
  canonical.href = href;

  if (!canonical.parentElement) {
    document.head.appendChild(canonical);
  }
}

function setJsonLd(jsonLd: JsonLdInput) {
  let schema = document.getElementById("page-jsonld") as
    | HTMLScriptElement
    | null;

  if (!schema) {
    schema = document.createElement("script");
    schema.id = "page-jsonld";
    schema.type = "application/ld+json";
    document.head.appendChild(schema);
  }

  schema.textContent = JSON.stringify(jsonLd);
}
