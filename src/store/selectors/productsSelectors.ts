import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import type { Product } from '@/types';

export const selectProductsState = (state: RootState) => state.products;

export const selectProductsById = createSelector(selectProductsState, (s) => s.byId);

export const selectProductsIds = createSelector(selectProductsState, (s) => s.ids);

export const selectProductsArray = createSelector(selectProductsById, selectProductsIds, (byId, ids) => ids.map((id) => byId[id]) as Product[]);

export const selectProductsTotal = createSelector(selectProductsState, (s) => s.total);

export const selectProductsStatus = createSelector(selectProductsState, (s) => s.status);

export const selectProductsError = createSelector(selectProductsState, (s) => s.error);

export const selectProductById = createSelector(
  [selectProductsById, (_state: RootState, id: number) => id],
  (byId, id) => byId[id] as Product | undefined
);
