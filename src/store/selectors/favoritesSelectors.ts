import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { Product } from "@/types";

export const selectFavoritesState = (state: RootState) => state.favorites;

export const selectFavoritesById = createSelector(
  selectFavoritesState,
  (favoritesState) => favoritesState.byId
);

export const selectFavoritesArray = createSelector(
  selectFavoritesById,
  (byId) => Object.values(byId) as Product[]
);

export const selectFavoriteIds = createSelector(selectFavoritesById, (byId) =>
  Object.keys(byId).map((k) => Number(k))
);

export const makeSelectIsFavorite = (id: number) =>
  createSelector(selectFavoritesById, (byId) => Boolean(byId[id]));

export const selectIsFavorite = (state: RootState, id: number) =>
  Boolean(state.favorites.byId[id]);
