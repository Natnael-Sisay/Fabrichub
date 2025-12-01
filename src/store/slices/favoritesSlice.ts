import { Product } from '@/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FavoritesState {
  byId: Record<number, Product>;
}

const initialState: FavoritesState = {
  byId: {},
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite(state, action: PayloadAction<Product>) {
      state.byId[action.payload.id] = action.payload;
    },
    removeFavorite(state, action: PayloadAction<number>) {
      delete state.byId[action.payload];
    },
    toggleFavorite(state, action: PayloadAction<Product>) {
      const id = action.payload.id;
      if (state.byId[id]) {
        delete state.byId[id];
      } else {
        state.byId[id] = action.payload;
      }
    },
    setFavorites(state, action: PayloadAction<Product[]>) {
      state.byId = action.payload.reduce((acc, p) => ({ ...acc, [p.id]: p }), {} as Record<number, Product>);
    },
    clearFavorites(state) {
      state.byId = {};
    },
  },
});

export const { addFavorite, removeFavorite, toggleFavorite, setFavorites, clearFavorites } = favoritesSlice.actions;

export const selectFavoritesArray = (state: { favorites: FavoritesState }) => Object.values(state.favorites.byId);
export const selectFavoriteIds = (state: { favorites: FavoritesState }) => Object.keys(state.favorites.byId).map((k) => Number(k));
export const selectIsFavorite = (state: { favorites: FavoritesState }, id: number) => Boolean(state.favorites.byId[id]);

export default favoritesSlice.reducer;
