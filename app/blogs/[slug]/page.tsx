"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { getBlogBySlug, getAllBlogs, type Blog } from "@/app/actions/blog-actions"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Calendar, Clock, ArrowLeft, Share2, BookmarkPlus, ArrowRight } from "lucide-react"

export default function BlogDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params?.slug as string

  const [blog, setBlog] = useState<Blog | null>(null)
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadBlog() {
      setLoading(true)
      const blogData = await getBlogBySlug(slug)
      
      if (!blogData) {
        router.push("/blogs")
        return
      }
      
      setBlog(blogData)

      // Get related blogs from same category
      const allBlogs = await getAllBlogs()
      const related = allBlogs
        .filter(b => b.category === blogData.category && b.id !== blogData.id)
        .slice(0, 3)
      setRelatedBlogs(related)
      
      setLoading(false)
    }
    
    if (slug) {
      loadBlog()
    }
  }, [slug, router])

  if (loading) {
    return (
      <>
        <SiteHeader />
        <main className="min-h-screen py-12">
          <div className="mx-auto max-w-4xl px-4 md:px-6">
            <div className="h-8 bg-secondary/30 rounded animate-pulse w-32 mb-8"></div>
            <div className="h-96 bg-secondary/30 rounded-lg animate-pulse mb-8"></div>
            <div className="space-y-4">
              <div className="h-6 bg-secondary/30 rounded animate-pulse"></div>
              <div className="h-6 bg-secondary/30 rounded animate-pulse w-5/6"></div>
              <div className="h-6 bg-secondary/30 rounded animate-pulse w-4/6"></div>
            </div>
          </div>
        </main>
        <SiteFooter />
      </>
    )
  }

  if (!blog) {
    return null
  }

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        {/* Back Button */}
        <div className="bg-gradient-to-r from-secondary/10 to-background pt-6">
          <div className="mx-auto max-w-[1400px] px-4 md:px-6 py-6">
            <Button variant="ghost" onClick={() => router.push("/blogs")} className="group hover:bg-secondary/50">
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to All Articles
            </Button>
          </div>
        </div>

        {/* Article Header */}
        <article className="py-12">
          <div className="mx-auto max-w-[1400px] px-4 md:px-6">
            {/* Meta Info & Category */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <Badge className="bg-primary text-white border-0 px-4 py-1.5 text-sm font-semibold">
                {blog.category}
              </Badge>
              <div className="h-1 w-1 rounded-full bg-muted-foreground/30"></div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{blog.readTime} min read</span>
              </div>
              <div className="h-1 w-1 rounded-full bg-muted-foreground/30"></div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{blog.publishedDate ? blog.publishedDate.toLocaleDateString("en-US", { 
                  month: "long", 
                  day: "numeric", 
                  year: "numeric" 
                }) : "Date not available"}</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-8 leading-tight">
              {blog.title}
            </h1>

            {/* Excerpt */}
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 leading-relaxed font-light border-l-4 border-primary pl-6 italic">
              {blog.excerpt}
            </p>

            {/* Featured Image */}
            <div className="relative h-[400px] md:h-[550px] lg:h-[600px] rounded-2xl overflow-hidden mb-12 shadow-2xl">
              <Image
                src={blog.imageUrl}
                alt={blog.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Content */}
            <div className="mb-16 max-w-none blog-content">
              <style dangerouslySetInnerHTML={{__html: `
                .blog-content h3 {
                  font-size: 1.5rem;
                  font-weight: 700;
                  margin-top: 2rem;
                  margin-bottom: 1rem;
                  line-height: 1.3;
                }
                .blog-content p {
                  font-size: 1.125rem;
                  line-height: 1.75rem;
                  margin-bottom: 1.5rem;
                }
                .blog-content hr {
                  margin-top: 2rem;
                  margin-bottom: 2rem;
                  border: none;
                  border-top: 1px solid rgba(0, 0, 0, 0.1);
                }
                .blog-content strong {
                  font-weight: 700;
                }
              `}} />
              <div dangerouslySetInnerHTML={{ __html: blog.content }} />
            </div>

            {/* Tags */}
            <div className="pt-10 mb-10">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-bold text-foreground uppercase tracking-wide">Tagged:</span>
                {blog.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="capitalize px-4 py-1.5 text-sm font-medium hover:bg-primary hover:text-white transition-colors cursor-pointer">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </article>

        {/* Related Articles */}
        {relatedBlogs.length > 0 && (
          <section className="py-20 bg-gradient-to-b from-secondary/5 via-secondary/10 to-background border-t-2">
            <div className="mx-auto max-w-[1400px] px-4 md:px-6">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-3">Continue Reading</h2>
                <p className="text-muted-foreground text-lg">More articles you might enjoy</p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                {relatedBlogs.map((relatedBlog) => (
                  <Link key={relatedBlog.id} href={`/blogs/${relatedBlog.slug}`}>
                    <Card className="overflow-hidden border hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 group h-full flex flex-col">
                      <div className="relative h-56 overflow-hidden">
                        <Image
                          src={relatedBlog.imageUrl}
                          alt={relatedBlog.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <Badge className="absolute top-4 left-4 bg-white/95 text-foreground border-0 backdrop-blur-sm">
                          {relatedBlog.category}
                        </Badge>
                      </div>
                      
                      <div className="p-6 flex flex-col flex-grow">
                        <h3 className="text-xl font-bold mb-3 leading-tight group-hover:text-primary transition-colors line-clamp-2">
                          {relatedBlog.title}
                        </h3>
                        
                        <p className="text-sm text-muted-foreground line-clamp-3 flex-grow mb-4">
                          {relatedBlog.excerpt}
                        </p>
                        
                        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-4 border-t">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{relatedBlog.readTime} min read</span>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  )
}
