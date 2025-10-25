import { useStore } from '../store/store'

const products = [
  {
    id: 'cake-rose-velvet',
    name: 'Rose Velvet Cake',
    price: 29.99,
    image:
      'https://images.unsplash.com/photo-1545018877-5bfd043de04b?q=80&w=1200&auto=format&fit=crop',
    desc: 'Fluffy velvet layers infused with rose essence and cream cheese frosting.',
  },
  {
    id: 'cake-berry-bliss',
    name: 'Berry Bliss Cheesecake',
    price: 34.99,
    image:
      'https://images.unsplash.com/photo-1519869325930-281384150729?q=80&w=1200&auto=format&fit=crop',
    desc: 'Rich cheesecake topped with a symphony of fresh berries.',
  },
  {
    id: 'cake-choco-drip',
    name: 'Chocolate Drip Cake',
    price: 39.99,
    image:
      'https://images.unsplash.com/photo-1541976076758-347942db1970?q=80&w=1200&auto=format&fit=crop',
    desc: 'Moist chocolate sponge with dark ganache and cocoa nibs.',
  },
  {
    id: 'cake-lemon-meringue',
    name: 'Lemon Meringue Cake',
    price: 32.99,
    image:
      'https://images.unsplash.com/photo-1571115764596-2483dff4759d?q=80&w=1200&auto=format&fit=crop',
    desc: 'Tangy lemon curd layers crowned with torched meringue.',
  },
]

export default function ProductGrid() {
  const { dispatch } = useStore()

  return (
    <section aria-labelledby="cakes-heading" className="py-10 sm:py-12 lg:py-16 bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 id="cakes-heading" className="text-2xl sm:text-3xl font-bold text-gray-900">Featured Cakes</h2>
          <p className="mt-2 text-gray-600">Crafted with love, baked fresh daily.</p>
        </div>
        <ul role="list" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((p) => (
            <li key={p.id} className="group bg-white rounded-xl shadow-sm ring-1 ring-gray-100 overflow-hidden focus-within:ring-2 focus-within:ring-pink-400">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={p.image}
                  alt={`${p.name} cake`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                />
              </div>
              <div className="p-4 flex flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-lg font-semibold text-gray-900">{p.name}</h3>
                  <span className="text-pink-700 font-semibold" aria-label={`Price ${p.price.toFixed(2)} dollars`}>${p.price.toFixed(2)}</span>
                </div>
                <p className="text-sm text-gray-600">{p.desc}</p>
                <div className="mt-2">
                  <button
                    onClick={() => dispatch({ type: 'ADD_TO_CART', payload: p })}
                    className="w-full inline-flex justify-center items-center px-4 py-2 rounded-md bg-pink-500 text-white hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-400"
                    aria-label={`Add ${p.name} to cart`}
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
