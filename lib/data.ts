export type Product = {
  id: string
  title: string
  price: number
  image: string
}

export const products: Product[] = [
  { id: "1", title: "Minimalist Vase", price: 25, image: "/ceramic-vase-minimalist.jpg" },
  { id: "2", title: "Cozy Throw Blanket", price: 45, image: "/cozy-beige-blanket.jpg" },
  { id: "3", title: "Modern Wall Art", price: 60, image: "/abstract-wall-art-neutral.jpg" },
  { id: "4", title: "Elegant Candle Holder", price: 15, image: "/candle-holder-minimal.jpg" },
  // shop extras
  { id: "5", title: "Minimalist Sofa", price: 799, image: "/minimalist-sofa-beige.jpg" },
  { id: "6", title: "Modern Coffee Table", price: 349, image: "/wood-coffee-table-modern.jpg" },
  { id: "7", title: "Elegant Floor Lamp", price: 199, image: "/floor-lamp-warm-light.jpg" },
  { id: "8", title: "Cozy Throw Pillow", price: 49, image: "/cozy-throw-pillow-cream.jpg" },
  { id: "9", title: "Abstract Wall Art", price: 129, image: "/abstract-fan-art-neutral.jpg" },
  { id: "10", title: "Ceramic Vase Set", price: 89, image: "/ceramic-vase-set-neutral.jpg" },
]
