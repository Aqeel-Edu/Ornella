import Image from "next/image"
import Link from "next/link"
import { Heart } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { QuantityStepper } from "@/components/quantity-stepper"
import { HtmlContent } from "@/components/html-content"
import { getProductById } from "@/lib/firebase-utils"

export async function generateMetadata({ params }: { params: { id: string } }) {
  try {
    // Ensure params is resolved before accessing id
    const resolvedParams = await Promise.resolve(params);
    const product = await getProductById(resolvedParams.id);
    
    if (!product) {
      return {
        title: 'Product not found',
        description: 'The requested product could not be found.'
      };
    }

    return {
      title: product.title || 'Product',
      description: product.description || '',
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Error',
      description: 'There was an error loading the product.'
    };
  }
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = (await getProductById(params.id)) ?? {
    id: 'not-found',
    title: 'Product not found',
    price: 0,
    image: '/placeholder.svg',
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-10 grid gap-8 md:grid-cols-[1fr_420px]">
        <section>
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden border bg-card">
            <Image src={product.image || "/placeholder.svg"} alt={String(product.title ?? '')} fill className="object-cover" />
          </div>
        </section>

        <section>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{product.title}</h1>
          <div className="mt-2 text-primary font-semibold">${Number(product.price || 0).toFixed(2)}</div>
          <HtmlContent 
            html={product.description ?? 'No description available.'} 
            className="mt-4 text-sm leading-relaxed text-muted-foreground"
          />

          <div className="mt-6 flex items-center gap-3">
            <QuantityStepper />
            <button className="h-10 flex-1 rounded-md bg-primary text-primary-foreground font-medium hover:opacity-90">
              Add to Cart
            </button>
            <button
              className="h-10 w-10 inline-flex items-center justify-center rounded-md border"
              aria-label="Add to wishlist"
            >
              <Heart className="h-4 w-4" />
            </button>
          </div>

          <hr className="my-8" />

          <h3 className="text-lg md:text-xl font-bold">Product Specifications</h3>
          <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
            <div>
              <dt className="text-muted-foreground">Material</dt>
              <dd>{product.material ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Dimensions</dt>
              <dd>{product.dimensions ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Weight</dt>
              <dd>{product.weight ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Color</dt>
              <dd>{product.color ?? '—'}</dd>
            </div>
          </dl>

          <hr className="my-8" />

          <h3 className="text-lg md:text-xl font-bold">Care Instructions</h3>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {product.careInstructions ?? 'Wipe clean with a soft, damp cloth. Avoid harsh chemicals or abrasive cleaners.'}
          </p>

          <div className="mt-10">
            <Link href="/shop" className="text-sm text-primary underline">
              Back to shop
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
