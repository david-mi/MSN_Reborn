import { ThunkAction, AnyAction, ThunkDispatch, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store";
import type { AppDispatch } from "@/redux/store";

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  AnyAction
>

export type AppThunkDispatch = ThunkDispatch<
  RootState,
  unknown,
  AnyAction
>

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: RootState
  dispatch: AppDispatch
  rejectValue: string
}>()