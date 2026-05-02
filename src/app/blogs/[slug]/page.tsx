import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import dbConnect from "@/lib/db";
import Blog from "@/models/Blog";

interface BlogDetail {
  _id: string;
  title: string;
  slug: string;
  content: string;
  coverImage: string;
  createdAt: Date | string;
  tags?: string[];
  author?: { name?: string };
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getBlog(slug: string): Promise<BlogDetail | null> {
  await dbConnect();
  const blog = (await Blog.findOne({ slug, published: true })
    .populate("author", "name")
    .lean()) as unknown as BlogDetail | null;
  return blog;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) {
    return {
      title: "Article Not Found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const description = blog.content.slice(0, 155).trim();

  return {
    title: blog.title,
    description,
    alternates: {
      canonical: `https://techzoq.com/blogs/${blog.slug}`,
    },
    openGraph: {
      title: blog.title,
      description,
      url: `https://techzoq.com/blogs/${blog.slug}`,
      type: "article",
      images: blog.coverImage ? [blog.coverImage] : ["/og-image.png"],
      publishedTime: new Date(blog.createdAt).toISOString(),
    },
    twitter: {
      title: blog.title,
      description,
      images: blog.coverImage ? [blog.coverImage] : ["/og-image.png"],
    },
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) {
    notFound();
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    datePublished: new Date(blog.createdAt).toISOString(),
    dateModified: new Date(blog.createdAt).toISOString(),
    author: {
      "@type": "Person",
      name: blog.author?.name || "TECHZOQ Team",
    },
    publisher: {
      "@type": "Organization",
      name: "TECHZOQ",
      url: "https://techzoq.com",
    },
    mainEntityOfPage: `https://techzoq.com/blogs/${blog.slug}`,
    image: blog.coverImage || "https://techzoq.com/og-image.png",
    description: blog.content.slice(0, 155).trim(),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <Header />
      <article className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-sm font-medium text-primary-600 mb-4">TECHZOQ Blog</p>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-6">
              {blog.title}
            </h1>
            <div className="text-sm text-gray-500 flex flex-wrap gap-4">
              <span>By {blog.author?.name || "TECHZOQ Team"}</span>
              <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 md:p-12">
            <div className="prose prose-lg max-w-none whitespace-pre-line text-gray-700 leading-8">
              {blog.content}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}

