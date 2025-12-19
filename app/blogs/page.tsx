"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { getAllBlogs, type Blog } from "@/app/actions/blog-actions"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar, Clock, Search, ArrowRight, Sparkles, BookOpen, ChevronLeft, ChevronRight } from "lucide-react"

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const blogsPerPage = 15

  useEffect(() => {
    async function loadBlogs() {
      setLoading(true)
      const data = await getAllBlogs()
      setBlogs(data)
      setFilteredBlogs(data)
      setLoading(false)
    }
    loadBlogs()
  }, [])

  useEffect(() => {
    let filtered = blogs

    if (selectedCategory !== "all") {
      filtered = filtered.filter(blog => blog.category === selectedCategory)
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        blog =>
          blog.title.toLowerCase().includes(query) ||
          blog.excerpt.toLowerCase().includes(query) ||
          blog.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    setFilteredBlogs(filtered)
    setCurrentPage(1) // Reset to first page when filters change
  }, [searchQuery, selectedCategory, blogs])

  // Pagination calculations
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage)
  const startIndex = (currentPage - 1) * blogsPerPage
  const endIndex = startIndex + blogsPerPage
  const currentBlogs = filteredBlogs.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const categories = ["all", "Interior Design", "Bedroom Design", "Sustainability", "Small Spaces", "Seasonal Decor", "Color Theory"]

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary/5 via-background to-secondary/10 py-12 overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="mx-auto max-w-[1400px] px-4 md:px-6 relative">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">Interior Design Insights</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                Home Decor <span className="text-primary">Inspiration</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-4 leading-relaxed">
                Discover expert tips, design trends, and creative ideas to transform your living spaces into beautiful sanctuaries.
              </p>
              
              {/* Search Bar */}
              <div className="max-w-xl mx-auto">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search articles, tips, and ideas..."
                    className="pl-12 pr-4 py-6 text-base rounded-full border-2 focus:border-primary shadow-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="py-4 border-b bg-secondary/5">
          <div className="mx-auto max-w-[1400px] px-4 md:px-6">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Browse by Category</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <Button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className="rounded-full capitalize"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Grid */}
        <section className="py-16">
          <div className="mx-auto max-w-[1400px] px-4 md:px-6">
            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="rounded-xl overflow-hidden h-[350px]">
                    <div className="h-full bg-secondary/30 animate-pulse"></div>
                  </div>
                ))}
              </div>
            ) : filteredBlogs.length > 0 ? (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {currentBlogs.map((blog) => (
                  <Link key={blog.id} href={`/blogs/${blog.slug}`}>
                    <div className="rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 group h-[350px] cursor-pointer relative">
                      <div className="relative h-full overflow-hidden">
                        <Image
                          src={blog.imageUrl}
                          alt={blog.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                        
                        {/* Content overlay */}
                        <div className="absolute inset-0 flex flex-col justify-between p-6">
                          <div className="flex items-start justify-between">
                            <Badge className="bg-white/95 text-foreground border-0 backdrop-blur-sm font-semibold">
                              {blog.category}
                            </Badge>
                            <div className="flex items-center gap-1.5 text-xs text-white/90 bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-full">
                              <Clock className="h-3 w-3" />
                              {blog.readTime} min
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="text-2xl font-bold leading-tight text-white group-hover:text-primary transition-colors line-clamp-3">
                              {blog.title.split(' ').slice(0, 16).join(' ')}{blog.title.split(' ').length > 16 ? '...' : ''}
                            </h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-2">
                  <Button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    variant="outline"
                    size="icon"
                    className="h-10 w-10"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  <div className="flex gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      // Show first page, last page, current page, and pages around current
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <Button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            variant={currentPage === page ? "default" : "outline"}
                            className="h-10 w-10"
                          >
                            {page}
                          </Button>
                        )
                      } else if (page === currentPage - 2 || page === currentPage + 2) {
                        return <span key={page} className="flex items-center px-2">...</span>
                      }
                      return null
                    })}
                  </div>

                  <Button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    variant="outline"
                    size="icon"
                    className="h-10 w-10"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
            ) : (
              <Card className="p-12 text-center">
                <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No articles found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search or filter to find what you're looking for.
                </p>
                <Button onClick={() => { setSearchQuery(""); setSelectedCategory("all") }} variant="outline">
                  Clear Filters
                </Button>
              </Card>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
