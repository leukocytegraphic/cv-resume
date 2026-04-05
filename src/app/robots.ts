import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/result",
    },
    sitemap: "https://cv.creatorops.site/sitemap.xml",
  };
}
