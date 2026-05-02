import dbConnect from "@/lib/db";
import Blog from "@/models/Blog";
import BlogsPageClient, { BlogListItem } from "./BlogsPageClient";

export default async function BlogsPage() {
  let blogs: BlogListItem[] = [];

  try {
    await dbConnect();
    blogs = (await Blog.find({ published: true })
      .sort({ createdAt: -1 })
      .populate("author", "name")
      .lean()) as unknown as BlogListItem[];
  } catch {
    blogs = [];
  }

  return <BlogsPageClient blogs={blogs} />;
}
