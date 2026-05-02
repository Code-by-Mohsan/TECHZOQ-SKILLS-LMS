"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import { Calendar, User, ArrowRight } from "lucide-react";

export interface BlogListItem {
  _id: string;
  title: string;
  slug: string;
  content: string;
  author?: { name?: string };
  createdAt: string;
  coverImage: string;
  tags: string[];
}

export default function BlogsPageClient({
  blogs,
}: {
  blogs: BlogListItem[];
}) {
  const blogListSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "TECHZOQ Blog",
    url: "https://techzoq.com/blogs",
    blogPost: blogs.map((blog) => ({
      "@type": "BlogPosting",
      headline: blog.title,
      url: `https://techzoq.com/blogs/${blog.slug}`,
      datePublished: blog.createdAt,
      author: {
        "@type": "Person",
        name: blog.author?.name || "TECHZOQ Team",
      },
    })),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogListSchema) }}
      />
      <Header />

      <section className="bg-primary-900 pt-32 pb-20 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black mb-6"
          >
            Our Latest Insights
          </motion.h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            Stay updated with practical insights on technology, software
            learning, freelancing, and career growth.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {blogs.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog, index) => (
                <motion.article
                  key={blog._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-gray-100"
                >
                  <div className="h-48 bg-gray-200 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-2xl">
                      {blog.title.charAt(0)}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {blog.author?.name || "Admin"}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                      {blog.title}
                    </h2>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {blog.content.substring(0, 150)}...
                    </p>
                    <Link
                      href={`/blogs/${blog.slug}`}
                      className="inline-flex items-center text-primary-600 font-semibold hover:text-primary-700"
                    >
                      Read Article <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold text-gray-400">
                No blogs found yet.
              </h2>
              <p className="text-gray-500 mt-2">Check back soon for updates.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

