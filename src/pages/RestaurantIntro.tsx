// src/pages/RestaurantIntro.tsx
import { Link, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '../store'

export default function RestaurantIntro() {
  const { id } = useParams<{ id: string }>()
  const restaurant = useSelector((state: RootState) => state.restaurant.data)

  if (!restaurant) return null

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      {/* Large centered logo */}
      {restaurant.logo ? (
        <img
          src={restaurant.logo}
          alt={`${restaurant.name} logo`}
          className="w-64 h-64 md:w-80 md:h-80 object-contain mb-12 rounded-2xl shadow-2xl shadow-carbon-fire/30"
        />
      ) : (
        <div className="w-64 h-64 md:w-80 md:h-80 bg-carbon-stone rounded-2xl mb-12 flex items-center justify-center text-2xl">
          No logo
        </div>
      )}

      {/* Restaurant name (optional) */}
      <h2 className="text-4xl md:text-5xl text-gray-800 font-bold mb-10 text-center">
        {restaurant.name}
      </h2>

      {/* View Menu Button */}
      <Link
        to={`/restaurant-menu/${id}/menu`}
        className="px-12 py-5 bg-blue-500 hover:bg-orange-600 text-white text-xl md:text-2xl font-semibold rounded-full shadow-lg shadow-carbon-fire/40 transition-all transform hover:scale-105 active:scale-95"
      >
        View Menu
      </Link>

      {/* Footer - powered by prismco. © Year */}
      <footer className="text-center text-gray-500 text-sm mt-8 pb-6">
        Powered by{' '}
        <span className="font-extrabold text-[#001f3f]">prism</span>
        <span className="font-extrabold text-amber-600">co</span>
        <span className="font-extrabold text-red-600">.</span>
        {' '}© {new Date().getFullYear()}
      </footer>
      
    </div>
  )
}