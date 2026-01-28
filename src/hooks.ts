// src/hooks.ts

// Value imports (these may produce runtime code)
import { useDispatch, useSelector } from 'react-redux';

// Type-only import (no runtime code – required when verbatimModuleSyntax is on)
import type { TypedUseSelectorHook } from 'react-redux';

import type { RootState, AppDispatch } from './store';

// Use these typed versions throughout your app
// (instead of plain useDispatch / useSelector)
export const useAppDispatch: () => AppDispatch = useDispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;