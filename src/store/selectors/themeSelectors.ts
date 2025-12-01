import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../store';

export const selectThemeState = (state: RootState) => state.theme;

export const selectTheme = createSelector(selectThemeState, (s) => s.mode);

export const selectIsDark = createSelector(selectTheme, (mode) => mode === 'dark');
