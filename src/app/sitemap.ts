import type { MetadataRoute } from "next";
import dbConnect from "@/lib/db";
import { SERVICE_ROUTE_ENTRIES } from "@/lib/content/services";
import Course from "@/models/Course";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://techzoq.com";
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/founder`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/career-counseling-kasur`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/services`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/courses`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/coworking`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/login`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/signup`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  const serviceRoutes: MetadataRoute.Sitemap = SERVICE_ROUTE_ENTRIES.map(
    (service) => ({
      url: `${baseUrl}${service.path}`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.82,
    }),
  );

  // Dynamic course pages
  let courseRoutes: MetadataRoute.Sitemap = [];
  try {
    await dbConnect();
    const courses = (await Course.find({ isPublished: true })
      .select("slug updatedAt createdAt")
      .lean()) as unknown as { slug: string; updatedAt?: Date; createdAt?: Date }[];

    courseRoutes = courses.map((course) => ({
      url: `${baseUrl}/courses/${course.slug}`,
      lastModified: course.updatedAt || course.createdAt || lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch {
    // DB unavailable during build — skip dynamic routes
  }

  return [...staticRoutes, ...serviceRoutes, ...courseRoutes];
}
