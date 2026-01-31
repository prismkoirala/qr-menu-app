// src/features/restaurantSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'

const BASE_URL = import.meta.env.DEV 
  ? '/api/restaurants/'                    // dev: uses Vite proxy → backend 8000
  : (import.meta.env.VITE_API_URL || 'https://gipech.pythonanywhere.com') + '/api/restaurants/'

export interface HighlightedItem {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  item_order: number;
}
  interface Announcements {
  id: number
  title: string
  message: string
  start_date: string
  end_date: string
  is_active: number
  created_at: number
  updated_at: number
}
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
  is_disabled: boolean
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
  announcements: Announcements[]
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

  // ── NEW fields for highlighted items ───────────────────────────
  highlightedItems: HighlightedItem[];
  highlightedLoading: boolean;
  highlightedError: string | null;
  hasShownHighlighted: boolean,   // ← default false
  hasShownAnnouncements: boolean;
}

const initialState: RestaurantState = {
  data: null,
  loading: false,
  error: null,

  highlightedItems: [],
  highlightedLoading: false,
  highlightedError: null,
  hasShownHighlighted: false,   // ← default false
  hasShownAnnouncements: false
}


// ── Thunks ───────────────────────────────────────────────────────

export const fetchHighlightedItems = createAsyncThunk<
  HighlightedItem[],
  number,
  { rejectValue: string }
>(
  'restaurant/fetchHighlightedItems',
  async (restaurantPk, { rejectWithValue }) => {
    try {
      // Important: use BASE_URL here too → consistent with fetchRestaurant
      const url = `${BASE_URL}${restaurantPk}/highlighted-items/`;
      const response = await axios.get(url);
      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load today's specials"
      );
    }
  }
);


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
      // Optional: also clear highlighted when clearing restaurant
      state.highlightedItems = [];
      state.highlightedLoading = false;
      state.highlightedError = null;
      state.hasShownHighlighted = false;   // reset flag
      state.hasShownAnnouncements = false;
    },
    // NEW reducer to mark as shown
    markHighlightedAsShown(state) {
      state.hasShownHighlighted = true;
    },
    // NEW: action to mark announcements as shown
    markAnnouncementsAsShown(state) {
      state.hasShownAnnouncements = true;
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

      // ── NEW: fetchHighlightedItems cases ────────────────────────
      .addCase(fetchHighlightedItems.pending, (state) => {
        state.highlightedLoading = true;
        state.highlightedError = null;
      })
      .addCase(
        fetchHighlightedItems.fulfilled,
        (state, action: PayloadAction<HighlightedItem[]>) => {
          state.highlightedLoading = false;
          state.highlightedItems = action.payload;
        }
      )
      .addCase(fetchHighlightedItems.rejected, (state, action) => {
        state.highlightedLoading = false;
        state.highlightedError = action.payload || 'Something went wrong';
      })
      // Optional: reset flag when fetch fails or no items
    // .addCase(fetchHighlightedItems.fulfilled, (state, action) => {
    //   state.highlightedLoading = false;
    //   state.highlightedItems = action.payload;
    //   // We could auto-set hasShownHighlighted = false here if needed,
    //   // but we'll control it from the component
    // });

  },
})

// Optional: export the clear action if you want to use it
// VERY IMPORTANT: Export the action creator
export const { 
  markHighlightedAsShown,    // ← must be here
  clearRestaurant,
  markAnnouncementsAsShown,   // ← export it
} = restaurantSlice.actions;

export default restaurantSlice.reducer

export const selectRestaurantData = (state: { restaurant: RestaurantState }) => 
  state.restaurant.data;

export const selectRestaurantLoading = (state: { restaurant: RestaurantState }) => 
  state.restaurant.loading;

export const selectRestaurantError = (state: { restaurant: RestaurantState }) => 
  state.restaurant.error;

export const selectHighlightedItems = (state: { restaurant: RestaurantState }) => 
  state.restaurant.highlightedItems;

export const selectHighlightedLoading = (state: { restaurant: RestaurantState }) => 
  state.restaurant.highlightedLoading;

export const selectHighlightedError = (state: { restaurant: RestaurantState }) => 
  state.restaurant.highlightedError;