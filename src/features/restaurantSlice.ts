// src/features/restaurantSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'

const BASE_URL = import.meta.env.DEV 
  ? '/api/restaurants/'                    // dev: uses Vite proxy → backend 8000
  : (import.meta.env.VITE_API_URL || 'https://gipech.pythonanywhere.com') + '/api/restaurants/'

interface MenuItem {
  id: number
  name: string
  description: string
  price: string
  image: string
  item_order: number
}

interface Category {
  id: number
  name: string
  image: string
  cat_order: number
  items: MenuItem[]
}

interface MenuGroup {
  id: number
  type: string
  group_order: number
  categories: Category[]
}

interface Restaurant {
  id: number
  name: string
  address: string
  phone: string
  logo: string
  facebook_url: string
  instagram_url: string
  tiktok_url: string
  menu_groups: MenuGroup[]
}

interface RestaurantState {
  data: Restaurant | null
  loading: boolean
  error: string | null
}

const initialState: RestaurantState = {
  data: null,
  loading: false,
  error: null,
}

/**
 * Fetches restaurant data by ID
 * Usage: dispatch(fetchRestaurant(1))  // fetches /restaurants/1/
 */
export const fetchRestaurant = createAsyncThunk<
  Restaurant,           // Returned data type (success)
  number,               // Argument type passed to thunk (restaurant ID)
  { rejectValue: string }  // Type for rejected value
>(
  'restaurant/fetchRestaurant',
  async (restaurantId, { rejectWithValue }) => {
    try {
      const url = `${BASE_URL}${restaurantId}/`
      const response = await axios.get<Restaurant>(url)
      return response.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      // Handle different error shapes from axios
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        err.message ||
        'Failed to fetch restaurant data'
      return rejectWithValue(errorMessage)
    }
  }
)

const restaurantSlice = createSlice({
  name: 'restaurant',
  initialState,
  reducers: {
    // Optional: you could add a clearRestaurant reducer if needed
    clearRestaurant: (state) => {
      state.data = null
      state.loading = false
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Pending
      .addCase(fetchRestaurant.pending, (state) => {
        state.loading = true
        state.error = null
      })
      // Fulfilled
      .addCase(fetchRestaurant.fulfilled, (state, action: PayloadAction<Restaurant>) => {
        state.loading = false
        state.data = action.payload
      })
      // Rejected
      .addCase(fetchRestaurant.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Unknown error occurred'
      })
  },
})

// Optional: export the clear action if you want to use it
export const { clearRestaurant } = restaurantSlice.actions

export default restaurantSlice.reducer