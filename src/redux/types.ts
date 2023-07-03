import {
  ThunkAction,
  AnyAction,
  ThunkDispatch,
  createAsyncThunk,
  EmptyObject,
  ThunkMiddleware,
  CombinedState
} from "@reduxjs/toolkit";
import { RootState, AppDispatch } from "@/redux/store";
import { ProfileState } from "./slices/register/types";
import { ToolkitStore } from "@reduxjs/toolkit/dist/configureStore";

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

export type Store = ToolkitStore<EmptyObject & {
  register: ProfileState;
}, AnyAction, [ThunkMiddleware<CombinedState<{
  register: ProfileState;
}>, AnyAction>]>