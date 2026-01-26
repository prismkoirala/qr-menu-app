// src/pages/CategoryDetail.tsx
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '../store'

export default function CategoryDetail() {
  const { groupId, catId, id: restaurantId } = useParams<{ groupId: string; catId: string; id: string }>()
  const navigate = useNavigate()
  const restaurant = useSelector((state: RootState) => state.restaurant.data)

  if (!restaurant) {
    return <div className="text-center py-20 text-xl text-gray-400">Loading...</div>
  }

  const group = restaurant.menu_groups.find(g => g.id === Number(groupId))
  const category = group?.categories.find(c => c.id === Number(catId))

  if (!category) {
    return <div className="text-center py-20 text-xl text-red-400">Category not found</div>
  }

  return (
    <div className="min-h-screen pb-20 bg-white">
      {/* <Header /> */}

      {/* Category Header Image Section */}
      <div className="relative w-full">
        {/* Full-width, smaller height image */}
        <img
          src={category.image || 'https://via.placeholder.com/1200x400?text=No+Image'}
          alt={category.name}
          className="w-full h-56 md:h-64 lg:h-72 object-cover"
          onError={e => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/1200x400?text=No+Image'
          }}
        />

        {/* Bottom-to-top gradient overlay (50% coverage from bottom) */}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />

        {/* Category name at bottom-left */}
        <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white drop-shadow-2xl tracking-wide">
            {category.name}
          </h2>
        </div>
      </div>

      {/* Back Button - round, below image */}
      <div className="flex justify-left mt-6 ml-6 mb-10">
        <button
          onClick={() => navigate(`/restaurant-menu/${restaurantId}/menu`)}
          className="flex items-center gap-2 px-8 py-4 bg-carbon-stone hover:bg-gray-700 text-white font-medium rounded-full shadow-lg shadow-black/40 transition-all duration-300 hover:scale-105 active:scale-95"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 max-w-7xl mx-auto animate-fade-in-up">
        {category.items.map(item => (
          <div
            key={item.id}
            className="bg-carbon-stone/80 rounded-2xl overflow-hidden shadow-xl shadow-black/30 hover:shadow-carbon-fire/20 transition-all duration-300"
          >
            {/* {item.image && (
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover"
                onError={e => {
                  (e.target as HTMLImageElement).style.display = 'none'
                }}
              />
            )} */}

            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.name}</h3>
              {/* <p className="text-gray-800 mb-4 line-clamp-3">{item.description}</p> */}
              <div className="inline-block px-4 py-2 border-2 border-gray-900 rounded-lg bg-white shadow-sm">
                <p className="text-gray-950 font-bold text-lg">
                  Rs. {item.price}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}