// src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'             
import RestaurantLayout from './pages/RestaurantLayout'  
import RestaurantIntro from './pages/RestaurantIntro'
import MenuPage from './pages/MenuPage'
import CategoryDetail from './pages/CategoryDetail'

export default function App() {
  return (
    <Routes>
      {/* Root route */}
      <Route path="/" element={<Home />} />

      {/* Restaurant menu flow */}
      <Route path="/restaurant-menu/:id" element={<RestaurantLayout />}>
        <Route index element={<RestaurantIntro />} />           {/* default child */}
        <Route path="menu" element={<MenuPage />} />            {/* /restaurant-menu/:id/menu */}
        <Route path="category/:groupId/:catId" element={<CategoryDetail />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}