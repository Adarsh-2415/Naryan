import { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://narayanhomeopathy.com";

  // Baseline static routes
  const staticRoutes = [
    "",
    "/about",
    "/booking",
    "/gallery",
    "/treatments",
    "/case-studies",
    "/seminars",
    "/awards"
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8
  }));

  // Fetch dynamic case-studies from database to include them in Google indexing
  let caseStudyRoutes: any[] = [];
  if (supabase) {
    try {
      const { data } = await supabase
        .from("case_studies")
        .select("title, updated_at")
        .eq("status", "published");

      if (data) {
        caseStudyRoutes = data.map((item: any) => ({
          url: `${baseUrl}/case-studies/${slugify(item.title)}`,
          lastModified: new Date(item.updated_at || new Date()),
          changeFrequency: "monthly" as const,
          priority: 0.6
        }));
      }
    } catch (err) {
      console.error("Sitemap generation error for case studies:", err);
    }
  }

  return [...staticRoutes, ...caseStudyRoutes];
}
