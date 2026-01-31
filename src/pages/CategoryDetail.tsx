// src/pages/CategoryDetail.tsx
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'  // ← added useSearchParams
import { useSelector } from 'react-redux'
import type { RootState } from '../store'

export default function CategoryDetail() {
  const { groupId, catId, id: restaurantId } = useParams<{ groupId: string; catId: string; id: string }>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()  // ← NEW: read current URL query params

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
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />
        {/* Category name at bottom-left */}
        <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white drop-shadow-2xl tracking-wide">
            {category.name}
          </h2>
        </div>
      </div>

      {/* Back Button - now preserves current group */}
      <div className="flex justify-start mt-6 ml-6 mb-10">
        <button
          onClick={() => {
            // Read current ?group= from URL, default to 0
            const currentGroup = searchParams.get('group') || '0'
            navigate(`/restaurant-menu/${restaurantId}/menu?group=${currentGroup}`)
          }}
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 max-w-7xl mx-auto animate-fade-in-up">
        {category.items.map(item => {
          const isDisabled = item.is_disabled

          return (
            <div
              key={item.id}
              className={`
                group relative flex items-center justify-between
                rounded-2xl p-6
                transition-all duration-300 ease-out
                border
                ${isDisabled
                  ? 'bg-gray-100 dark:bg-gray-800/50 border-gray-300/50 dark:border-gray-700/50 opacity-70'
                  : 'bg-white/95 dark:bg-carbon-stone/90 shadow-lg shadow-black/10 hover:shadow-xl hover:shadow-carbon-fire/30 hover:-translate-y-1 border-gray-200/50 dark:border-gray-800/50'
                }
              `}
            >
              {/* Disabled badge */}
              {isDisabled && (
                <div className="absolute -top-2 -right-2 px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded-full shadow-md">
                  Unavailable
                </div>
              )}

              {/* Left side: Name + Description */}
              <div className="flex-1 pr-6">
                <h3 className={`
                  text-xl font-semibold mb-2 transition-colors
                  ${isDisabled
                    ? 'text-gray-500 dark:text-gray-500'
                    : 'text-gray-900 dark:text-gray-800 group-hover:text-carbon-fire'
                  }
                `}>
                  {item.name}
                </h3>
              </div>

              {/* Right-center: Price pill */}
              <div className="shrink-0 self-center">
                <div className={`
                  px-5 py-3 font-bold text-lg rounded-full
                  min-w-[100px] text-center
                  ${isDisabled
                    ? 'bg-gray-400 text-gray-200'
                    : 'bg-gradient-to-r from-blue-400 to-blue-800 text-white shadow-md shadow-carbon-fire/40'
                  }
                `}>
                  Rs. {item.price}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}