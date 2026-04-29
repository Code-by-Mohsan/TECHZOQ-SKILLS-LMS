import dbConnect from "@/lib/db";
import Course from "@/models/Course";
import CoursesPageClient, { CourseListItem } from "./CoursesPageClient";

export default async function CoursesPage() {
  let courses: CourseListItem[] = [];

  try {
    await dbConnect();
    const courseDocs = await Course.find({ isPublished: true })
      .select("title slug category level duration description thumbnail")
      .sort({ createdAt: -1 })
      .lean();

    courses = courseDocs.map((course: any) => ({
      _id: String(course._id),
      title: course.title,
      slug: course.slug,
      category: course.category,
      level: course.level,
      duration: course.duration,
      description: course.description,
      thumbnail: course.thumbnail,
    }));
  } catch {
    courses = [];
  }

  return <CoursesPageClient initialCourses={courses} />;
}
