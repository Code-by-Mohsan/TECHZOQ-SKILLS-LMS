import type { Metadata } from "next";
import { notFound } from "next/navigation";
import dbConnect from "@/lib/db";
import Course from "@/models/Course";
import CourseDetailClient, { CourseDetailData } from "./CourseDetailClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getCourseBySlug(slug: string): Promise<CourseDetailData | null> {
  await dbConnect();
  const course = (await Course.findOne({ slug, isPublished: true })
    .select("title slug category description level duration thumbnail features curriculum instructor price")
    .lean()) as CourseDetailData | null;
  return course;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);

  if (!course) {
    return {
      title: "Course Not Found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const description = `${course.title} at TECHZOQ Skills. ${course.description}`;

  return {
    title: course.title,
    description,
    keywords: [
      course.title,
      course.category,
      `${course.title} in Kasur`,
      `${course.title} course in Pakistan`,
      "TECHZOQ Skills",
      "IT course admissions",
    ],
    alternates: {
      canonical: `https://techzoq.com/courses/${course.slug}`,
    },
    openGraph: {
      title: `${course.title} | TECHZOQ`,
      description,
      url: `https://techzoq.com/courses/${course.slug}`,
      type: "article",
      images: course.thumbnail
        ? [
            {
              url: course.thumbnail,
              alt: course.title,
            },
          ]
        : ["/og-image.png"],
    },
    twitter: {
      title: `${course.title} | TECHZOQ`,
      description,
      images: course.thumbnail ? [course.thumbnail] : ["/og-image.png"],
    },
  };
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);

  if (!course) {
    notFound();
  }

  return <CourseDetailClient course={course} />;
}

