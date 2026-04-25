import type { Metadata } from "next";
import Footer from "@/app/archived/components/Footer";
import { getBlogPosts } from "@/lib/blog";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Blog | Trajectory",
  description: "Insights, updates, and thought leadership on real estate AI and property intelligence from the Trajectory team.",
};

export default function BlogPage() {
  const blogPosts = getBlogPosts();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative py-32 px-4 pt-48">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="font-canela text-5xl md:text-6xl font-medium text-black mb-6">
            Petal Blog
          </h1>
          <p className="font-manrope text-sm md:text-base text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Written thoughts and team features on everything<br/>you need to know about the latest in AI in Real Estate and Petal.
          </p>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="max-w-6xl mx-auto px-4 pb-32">
        {blogPosts.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-manrope text-gray-500 text-lg">
              No blog posts yet. Check back soon for insights from the Petal team.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article
                key={post.id}
                className="group cursor-pointer bg-white border border-gray-200 rounded-none overflow-hidden hover:bg-amber-50 transition-all duration-300"
              >
                <Link href={`/blog/${post.id}`} className="block">
                  {/* Image */}
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Date */}
                    <div className="mb-3">
                      <time className="font-manrope text-sm text-gray-500">
                        {post.datePublished}
                      </time>
                    </div>

                    {/* Title */}
                    <h3 className="font-canela text-2xl font-semibold text-black mb-3 line-clamp-2 group-hover:text-gray-700 transition-colors">
                      {post.title}
                    </h3>

                    {/* Description */}
                    <p className="font-manrope text-gray-600 leading-relaxed mb-4 line-clamp-3">
                      {post.description}
                    </p>

                    {/* Read Time (if available) */}
                    {post.readTime && (
                      <div className="flex items-center text-sm text-gray-500">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {post.readTime} min read
                      </div>
                    )}
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}