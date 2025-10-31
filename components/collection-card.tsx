import Link from "next/link"
import Image from "next/image"

export function CollectionCard({
  title,
  imageSrc,
  href,
}: {
  title: string
  imageSrc: string
  href: string
}) {
  return (
    <Link 
      href={href}
      className="block relative overflow-hidden rounded-lg h-72 md:h-80 group"
    >
      <div className="absolute inset-0">
        <Image 
          src={imageSrc || "/placeholder.svg"} 
          alt={title} 
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105" 
        />
      </div>
      {/* Gradient overlay for better text visibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
      
      {/* Centered content with hover effect */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 transform group-hover:scale-105 transition-transform duration-500">
        <h3 className="text-white text-2xl md:text-3xl font-bold text-center mb-2 tracking-wide drop-shadow-lg">
          {title}
        </h3>
        <div className="w-12 h-0.5 bg-white/70 rounded transition-all duration-500 group-hover:w-24" />
        <span className="mt-3 text-white/90 text-sm font-medium tracking-wider uppercase">
          Shop Now
        </span>
      </div>
    </Link>
  )
}
