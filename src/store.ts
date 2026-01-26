// src/store.ts
import { configureStore } from '@reduxjs/toolkit'
import restaurantReducer from './features/restaurantSlice'

const store = configureStore({
  reducer: {
    restaurant: restaurantReducer,
  },
})

// These are pure types – no runtime code
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store