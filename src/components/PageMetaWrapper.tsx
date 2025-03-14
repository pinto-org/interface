import { Helmet } from "react-helmet-async";
import META, { MetaSlug } from "@/constants/meta";
export interface PageMetaWrapperProps {
  children: React.ReactNode;
  metaKey: MetaSlug;
}

const PINTO_LOGO_URL = 'https://pinto.money/pinto-logo.png';

const PINTO_HERO_URL = 'https://pinto.money/pinto-hero.png';

export default function PageMetaWrapper({ metaKey, children }: PageMetaWrapperProps) {
  const { title, description, url, imgUrl } = META[metaKey] ?? META.index;

  return (
    <>
      <Helmet>
        {/* HTML Language */}
        <html lang="en" />
        {/* JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Pinto",
            url: url,
            "image": PINTO_LOGO_URL,
            description: description,
            operatingSystem: "All",
            "logo": {
              "@type": "ImageObject",
              "url": PINTO_LOGO_URL,
              "width": 512,
              "height": 512
            },
            "author": {
              "@type": "Organization",
              "name": "Pinto",
              "url": "https://pinto.money",
            }
          })}
        </script>

        {/* Primary Meta Tags */}
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="robots" content="index, follow" />

        <link rel="canonical" href={url} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={url} />
        {/* On Open Graph & Twitter links, render the pinto hero logo */}
        <meta property="og:image" content={imgUrl ?? PINTO_HERO_URL} />
        <meta property="og:locale" content="en_US" />
        <meta property="og:site_name" content="Pinto" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@pintodotmoney" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={imgUrl ?? PINTO_HERO_URL} />
      </Helmet>
      {children}
    </>
  );
}