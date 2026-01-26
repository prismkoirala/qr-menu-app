// src/pages/RestaurantLayout.tsx
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useParams } from 'react-router-dom'
import { fetchRestaurant } from '../features/restaurantSlice'
import type { RootState, AppDispatch } from '../store'
// import Header from '../components/Header'  // your existing header with logo & socials

export default function RestaurantLayout() {
  const { id } = useParams<{ id: string }>()
  const dispatch = useDispatch<AppDispatch>()
  const { loading, error, data } = useSelector((state: RootState) => state.restaurant)

  const restaurantId = Number(id)

  useEffect(() => {
    if (!isNaN(restaurantId) && restaurantId > 0) {
      dispatch(fetchRestaurant(restaurantId))
    }
  }, [dispatch, restaurantId])

  if (isNaN(restaurantId) || restaurantId <= 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400 text-2xl">
        Invalid restaurant ID
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl">
        Loading restaurant...
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-xl">
        {error || 'Restaurant not found'}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Optional: always show header with logo */}
      {/* <Header /> */}

      {/* Render child routes: Intro or Menu or Category */}
      <Outlet />
    </div>
  )
}