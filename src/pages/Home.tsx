// src/pages/Home.tsx
export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-carbon-dark text-white">
      <div className="text-center px-4">
        <h1 className="text-5xl md:text-7xl font-bold mb-6">Welcome</h1>
        <p className="text-xl md:text-2xl opacity-80 mb-10">
          Enter a restaurant ID to view the menu
        </p>
        <p className="text-lg">
          Try: <span className="text-carbon-fire font-semibold">/restaurant-menu/1</span>
        </p>
      </div>
    </div>
  )
}