import type { Metadata } from "next";
import Footer from "@/app/archived/components/Footer";
import { getBlogPost, getRelatedPosts } from "@/lib/blog";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import React from "react";

interface BlogPostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { id } = await params;
  const post = getBlogPost(id);
  
  if (!post) {
    return {
      title: "Post Not Found | Petal Blog",
    };
  }

  return {
    title: `${post.title} | Petal Blog`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      images: [post.image],
      type: "article",
      publishedTime: new Date(post.datePublished).toISOString(),
    },
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const { id } = React.use(params);
  const post = getBlogPost(id);
  const relatedPosts = getRelatedPosts(id);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 py-24">
        {/* Back Button */}
        <div className="mb-12">
          <Link 
            href="/blog" 
            className="inline-flex items-center font-manrope text-gray-600 hover:text-black transition-colors"
          >
            <svg 
              className="w-4 h-4 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15 19l-7-7 7-7" 
              />
            </svg>
            Back to Blog
          </Link>
        </div>

        {/* Title */}
        <h1 className="font-canela text-4xl md:text-5xl font-medium text-black mb-6 leading-tight">
          {post.title}
        </h1>
        
        {/* Author */}
        {post.author && (
          <div className="mb-4">
            <p className="font-manrope text-lg text-gray-600">By {post.author}</p>
          </div>
        )}

        {/* Date */}
        <div className="mb-8">
          <time className="font-manrope text-sm text-gray-500">
            {post.datePublished}
          </time>
          {post.readTime && (
            <>
              <span className="mx-2">•</span>
              <span className="font-manrope text-sm text-gray-500">{post.readTime} min read</span>
            </>
          )}
        </div>

        {/* Image */}
        <div className="mb-12">
          <div className="relative w-full max-w-lg mx-auto">
            <Image
              src={post.image}
              alt={post.title}
              width={400}
              height={267}
              className="w-full h-auto rounded-lg"
              priority
            />
          </div>
        </div>
        {/* Description */}
        <div className="mb-12">
          <p className="font-manrope text-xl text-gray-600 leading-relaxed">
            {post.description}
          </p>
        </div>

        {/* Blog Content */}
        <div 
          className="max-w-none font-manrope text-gray-800 leading-relaxed blog-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Share Section */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-manrope text-gray-600">
              Share this article
            </p>
            <div className="flex gap-4">
                      <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://nura.construction/blog/${post.id}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-black transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://nura.construction/blog/${post.id}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-black transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 py-16 border-t border-gray-200">
          <h2 className="font-canela text-3xl font-medium text-black mb-8">
            Related Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedPosts.map((relatedPost) => (
              <article
                key={relatedPost.id}
                className="group cursor-pointer bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <Link href={`/blog/${relatedPost.id}`} className="block">
                  {/* Image */}
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={relatedPost.image}
                      alt={relatedPost.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Date */}
                    <div className="mb-3">
                      <time className="font-manrope text-sm text-gray-500">
                        {relatedPost.datePublished}
                      </time>
                    </div>

                    {/* Title */}
                    <h3 className="font-canela text-xl font-semibold text-black mb-3 line-clamp-2 group-hover:text-gray-700 transition-colors">
                      {relatedPost.title}
                    </h3>

                    {/* Description */}
                    <p className="font-manrope text-gray-600 leading-relaxed mb-4 line-clamp-3">
                      {relatedPost.description}
                    </p>

                    {/* Read Time (if available) */}
                    {relatedPost.readTime && (
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
                        {relatedPost.readTime} min read
                      </div>
                    )}
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}