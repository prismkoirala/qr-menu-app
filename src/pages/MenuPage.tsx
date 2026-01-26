// src/pages/MenuPage.tsx
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import type { RootState } from '../store'
import Header from '../components/Header.tsx'

export default function MenuPage() {
  const restaurant = useSelector((state: RootState) => state.restaurant.data)
  const [activeGroup, setActiveGroup] = useState(0)
  const [search, setSearch] = useState('')

  if (!restaurant) {
    return <div className="text-center py-20 text-xl text-gray-400">Loading...</div>
  }

  const groups = restaurant.menu_groups || []

  // ── Normal mode: categories of current group ──
  const currentGroup = groups[activeGroup]
  const filteredCategories = currentGroup?.categories?.filter(cat =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  ) ?? []

  // ── Global search mode: all items from all groups ──
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
      {/* Group Pills – only shown when not searching */}
      {!isSearching && (
        <div className="flex justify-center gap-3 flex-wrap px-4 my-8">
          {groups.map((group, idx) => (
            <button
              key={group.id}
              onClick={() => setActiveGroup(idx)}
              className={`px-7 py-3 rounded-full font-medium text-base transition-all duration-300 shadow-md ${
                activeGroup === idx
                  ? 'bg-blue-500 text-white shadow-lg shadow-carbon-fire/50 scale-105'
                  : 'bg-[#1e1e1e] text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {group.type.toUpperCase()}
            </button>
          ))}
        </div>
      )}

      {/* Search Bar – always visible */}
      <div className="max-w-2xl mx-auto px-4 mb-10 relative">
        <input
          type="text"
          placeholder="Search your deliciousness here..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full px-6 py-4 bg-carbon-stone/70 border border-gray-700 rounded-full text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-carbon-fire/60 backdrop-blur-sm pr-12"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
          >
            ✕ CLEAR
          </button>
        )}
      </div>

      {/* Content: either categories or global items */}
      {isSearching ? (
        // ── Global Item Search Results ──
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          {filteredItems.length === 0 ? (
            <p className="text-center py-16 text-gray-400 text-lg">
              No menu items found matching "{search}"
            </p>
          ) : (
            filteredItems.map(item => (
              <Link
                key={item.id}
                to={`/restaurant-menu/${restaurant.id}/category/${item.groupId}/${item.catId}`}
                className="flex items-center gap-4 bg-carbon-stone/80 rounded-xl p-4 hover:bg-carbon-stone transition-colors group animate-fade-in-up"
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg shrink-0"
                    onError={e => (e.currentTarget.style.display = 'none')}
                  />
                ) : (
                  <div className="w-20 h-20 bg-gray-800 rounded-lg flex items-center justify-center text-gray-500 text-xs">
                    No img
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-800 truncate">{item.name}</h4>
                  <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                  <p className="text-gray-950 font-medium mt-1">Rs. {item.price}</p>
                </div>

                <div className="text-gray-500 text-sm whitespace-nowrap">
                  {item.categoryName}
                </div>
              </Link>
            ))
          )}
        </div>
      ) : (
        // ── Normal Category Grid ──
<div
  key={activeGroup} // Re-trigger animation on tab change
  className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 px-4 max-w-7xl mx-auto animate-fade-in-up"
>
  {filteredCategories.length === 0 ? (
    <p className="col-span-full text-center py-12 text-gray-400 text-lg">
      No matching categories
    </p>
  ) : (
    filteredCategories.map(cat => (
      <Link
        key={cat.id}
        to={`/restaurant-menu/${restaurant.id}/category/${currentGroup.id}/${cat.id}`}
        className="
          group relative rounded-xl overflow-hidden
          shadow-xl shadow-black/30
          hover:shadow-carbon-fire/40 hover:shadow-2xl
          transition-all duration-500 ease-out
          hover:-translate-y-1.5
          aspect-[4/3.5]  /* Slightly taller than square for better look */
        "
      >
        {/* Image */}
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

        {/* Gradient overlay - stronger at bottom */}
        <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/30 to-transparent" />

        {/* Category name - smaller on mobile */}
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
              // textStroke: '0.6px black',
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
    </div>
  )
}