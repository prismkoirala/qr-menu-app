// src/components/Header.tsx
import { useSelector } from 'react-redux'
import type { RootState } from '../store'

export default function Header() {
  const restaurant = useSelector((state: RootState) => state.restaurant.data)

  if (!restaurant) return null

  // Only show icons if URL exists and is not empty
  const hasFacebook = restaurant.facebook_url?.trim()
  const hasInstagram = restaurant.instagram_url?.trim()
  const hasTiktok = restaurant.tiktok_url?.trim()

  return (
    <header className="text-center py-6 bg-white">
      {/* Restaurant Logo (if exists) */}
      {restaurant.logo && (
        <img
          src={restaurant.logo}
          alt={`${restaurant.name} logo`}
          className="mx-auto h-20 md:h-24 w-auto mb-4 rounded-full shadow-xl shadow-carbon-fire/20"
        />
      )}

      {/* Restaurant Name - smaller size */}
      <h1 className="text-3xl md:text-3xl font-bold tracking-tight text-gray-800 mb-4">
        MENU
      </h1>

      {/* Social Media Icons - only show if URL exists */}
      {(hasFacebook || hasInstagram || hasTiktok) && (
        <div className="flex justify-center items-center gap-6 mt-2">
          {/* Facebook */}
          {hasFacebook && (
            <a
              href={restaurant.facebook_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-3xl text-gray-800 hover:text-carbon-fire transition-colors duration-200"
              aria-label="Facebook"
            >
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.992 22 12z" />
              </svg>
            </a>
          )}

          {/* Instagram */}
          {hasInstagram && (
            <a
              href={restaurant.instagram_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-3xl text-gray-800 hover:text-carbon-fire transition-colors duration-200"
              aria-label="Instagram"
            >
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.332.014 7.052.072 2.99.228.228 2.99.072 7.052.014 8.332 0 8.741 0 12s.014 3.668.072 4.948c.228 4.062 2.99 6.824 6.052 6.98C8.332 23.986 8.741 24 12 24s3.668-.014 4.948-.072c4.062-.228 6.824-2.99 6.98-6.052.058-1.28.072-1.689.072-4.948s-.014-3.668-.072-4.948c-.228-4.062-2.99-6.824-6.052-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z" />
              </svg>
            </a>
          )}

          {/* TikTok */}
          {hasTiktok && (
            <a
              href={restaurant.tiktok_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-3xl text-gray-800 hover:text-carbon-fire transition-colors duration-200"
              aria-label="TikTok"
            >
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.53.02C13.84.02 15.14.04 16.44.04c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.99-1.29-.58-2.41-1.6-3.24-2.82v12.39c0 1.75-1.43 3.18-3.18 3.18-1.75 0-3.18-1.43-3.18-3.18 0-1.75 1.43-3.18 3.18-3.18.22 0 .44.02.65.06v-4.18c-.21-.03-.43-.06-.65-.06-3.31 0-6 2.69-6 6 0 3.31 2.69 6 6 6 3.31 0 6-2.69 6-6V5.38c1.17 1.07 2.53 1.84 4 2.18v-4.03c-1.47-.34-2.83-1.11-4-2.18V0h-4.47z" />
              </svg>
            </a>
          )}
        </div>
      )}
    </header>
  )
}