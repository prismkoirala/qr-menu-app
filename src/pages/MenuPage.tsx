// src/pages/MenuPage.tsx
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useSearchParams } from 'react-router-dom'
import type { RootState, AppDispatch } from '../store'
import { fetchHighlightedItems, markHighlightedAsShown, markAnnouncementsAsShown } from '../features/restaurantSlice'   // ← add this import
import Toast from '../components/Toast.tsx'
import Header from '../components/Header.tsx'
import HighlightedItems from '../components/HighlightedItems'                  // ← add this import

export default function MenuPage() {
  const dispatch = useDispatch<AppDispatch>()
  const restaurant = useSelector((state: RootState) => state.restaurant.data)
  const highlightedItems = useSelector((state: RootState) => state.restaurant.highlightedItems)
  const highlightedLoading = useSelector((state: RootState) => state.restaurant.highlightedLoading)
  const hasShownAnnouncements = useSelector(
    (state: RootState) => state.restaurant.hasShownAnnouncements
  );

  const [searchParams, setSearchParams] = useSearchParams()
  const [activeGroup, setActiveGroup] = useState(() => {
    const groupFromUrl = searchParams.get('group')
    return groupFromUrl ? Number(groupFromUrl) : 0
  })
  const [search, setSearch] = useState('')
  const [activeToast, setActiveToast] = useState<number | null>(null); // ← start with null always

  // NEW: control dialog visibility
  const [showHighlighted, setShowHighlighted] = useState(false)
  // Add near the other states


  const hasShownHighlighted = useSelector(
  (state: RootState) => state.restaurant.hasShownHighlighted
);
// Fetch highlighted items once restaurant loads
  useEffect(() => {
    if (restaurant?.id) {
      dispatch(fetchHighlightedItems(restaurant.id));
    }
  }, [restaurant?.id, dispatch]);

// NEW: open dialog when data ready AND not yet shown
  useEffect(() => {
    if (
      !highlightedLoading &&
      highlightedItems.length > 0 &&
      !hasShownHighlighted
    ) {
      // Defer to avoid any remaining warnings (optional but safe)
      setTimeout(() => {
        setShowHighlighted(true);
        dispatch(markHighlightedAsShown());   // ← mark it in Redux
      }, 0);
    }
  }, [highlightedLoading, highlightedItems.length, hasShownHighlighted, dispatch]);

  // ── Auto-start announcements only once (respect Redux flag) ──────
  useEffect(() => {
    // Only attempt to start if we have announcements and haven't shown them yet
    if (
      restaurant?.announcements?.length &&
      !hasShownAnnouncements &&
      activeToast === null
    ) {
      setTimeout(() => {
        setActiveToast(0);                     // start first toast
        dispatch(markAnnouncementsAsShown());  // mark globally as shown
      }, 0);
    }
  }, [
    restaurant?.announcements?.length,
    hasShownAnnouncements,
    activeToast,
    dispatch,
  ]);

  const handleToastClose = () => {
    if (activeToast !== null && activeToast < (restaurant?.announcements?.length || 0) - 1) {
      setActiveToast(activeToast + 1)
    } else {
      setActiveToast(null)
    }
  }

  const handleTabChange = (idx: number) => {
    setActiveGroup(idx)
    setSearchParams({ group: idx.toString() })
  }

  if (!restaurant) {
    return <div className="min-h-screen flex items-center justify-center text-2xl text-gray-400">Loading...</div>
  }

  const groups = restaurant.menu_groups || []
  const currentGroup = groups[activeGroup] || groups[0]
  const filteredCategories = currentGroup?.categories?.filter(cat =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  ) ?? []

  const allItems = groups.flatMap(group =>
    group.categories.flatMap(cat =>
      cat.items.map(item => ({
        ...item,
        categoryName: cat.name,
        groupType: group.type,
        groupId: group.id,
        catId: cat.id,
      }))
    )
  )

  const filteredItems = search.trim()
    ? allItems.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description?.toLowerCase().includes(search.toLowerCase())
      )
    : []

  const isSearching = search.trim().length > 0

  return (
    <div className="min-h-screen pb-20 bg-white">
      <Header />

      {/* Group Pills – hidden during search */}
      {!isSearching && (
        <div className="flex justify-center gap-2 sm:gap-3 flex-wrap px-4 my-6 md:my-8">
          {groups.map((group, idx) => (
            <button
              key={group.id}
              onClick={() => handleTabChange(idx)}
              className={`
                px-4 py-2 sm:px-6 sm:py-3 rounded-full font-medium text-sm sm:text-base
                transition-all duration-300 shadow-md
                whitespace-nowrap
                ${
                  activeGroup === idx
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/50 scale-105'
                    : 'bg-[#1e1e1e] text-gray-300 hover:bg-gray-700 hover:text-white'
                }
              `}
            >
              {group.type.toUpperCase()}
            </button>
          ))}
        </div>
      )}

      {restaurant?.announcements?.map((ann, index) => (
        <Toast
          key={ann.id}
          title={ann.title}
          message={ann.message}
          duration={12000}
          onClose={handleToastClose}
          className={index === activeToast ? 'block' : 'hidden'}
        />
      ))}

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto px-4 mb-10 relative">
        <input
          type="text"
          placeholder="Search your deliciousness here..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full px-6 py-4 bg-gray-100 border border-gray-300 rounded-full text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 backdrop-blur-sm pr-12"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
          >
            ✕ CLEAR
          </button>
        )}
      </div>

      {/* Content – same as before */}
      {isSearching ? (
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          {filteredItems.length === 0 ? (
            <p className="text-center py-16 text-gray-500 text-lg">
              No menu items found matching "{search}"
            </p>
          ) : (
            filteredItems.map(item => (
              <Link
                key={item.id}
                to={`/restaurant-menu/${restaurant.id}/category/${item.groupId}/${item.catId}?group=${activeGroup}`}
                className="flex items-center gap-4 bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors group animate-fade-in-up"
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg shrink-0"
                    onError={e => (e.currentTarget.style.display = 'none')}
                  />
                ) : (
                  <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-xs">
                    No img
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 truncate">{item.name}</h4>
                  <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                  <p className="text-blue-600 font-medium mt-1">Rs. {item.price}</p>
                </div>
                <div className="text-gray-500 text-sm whitespace-nowrap">
                  {item.categoryName}
                </div>
              </Link>
            ))
          )}
        </div>
      ) : (
        <div
          key={activeGroup}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 px-4 max-w-7xl mx-auto animate-fade-in-up"
        >
          {filteredCategories.length === 0 ? (
            <p className="col-span-full text-center py-12 text-gray-500 text-lg">
              No matching categories
            </p>
          ) : (
            filteredCategories.map(cat => (
              <Link
                key={cat.id}
                to={`/restaurant-menu/${restaurant.id}/category/${currentGroup.id}/${cat.id}?group=${activeGroup}`}
                className={`
                  group relative rounded-xl overflow-hidden
                  shadow-xl shadow-black/20
                  hover:shadow-blue-500/30 hover:shadow-2xl
                  transition-all duration-500 ease-out
                  hover:-translate-y-2
                  aspect-[4/3.5]
                `}
              >
                                <img
                  src={cat.image}
                  alt={cat.name}
                  className="
                    absolute inset-0 w-full h-full object-cover
                    transition-transform duration-700 ease-out
                    group-hover:scale-110
                    brightness-90 group-hover:brightness-75
                  "
                  onError={e => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x350?text=No+Image'
                  }}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center px-4">
                  <h3
                    className="
                      text-lg sm:text-xl md:text-2xl font-bold text-white text-center tracking-wide
                      drop-shadow-2xl
                      transition-all duration-300
                      group-hover:drop-shadow-[0_6px_12px_rgba(0,0,0,0.8)]
                    "
                    style={{
                      textShadow: '0 3px 10px rgba(0,0,0,0.9), 0 1px 4px rgba(0,0,0,0.9)',
                      WebkitTextStroke: '0.6px black',
                    }}
                  >
                    {cat.name}
                  </h3>
                </div>
              </Link>
            ))
          )}
        </div>
      )}

      {/* Today's Special Dialog – auto-opens if there are items */}
      <HighlightedItems
        open={showHighlighted}
        onClose={() => setShowHighlighted(false)}
        restaurantId={restaurant.id}
      />
    </div>
  )
}