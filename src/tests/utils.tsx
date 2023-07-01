import React, { PropsWithChildren } from 'react'
import { Provider } from 'react-redux'
import { setupStore, AppStore, RootState } from "@/redux/store"
import type { PreloadedState } from '@reduxjs/toolkit'
import { RenderOptions, render } from '@testing-library/react'

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: PreloadedState<RootState>
  store?: AppStore
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {},
    store = setupStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: PropsWithChildren<{}>): JSX.Element {
    return <Provider store={store}>{children}</Provider>
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
}

/**
 * Avoid importing PreloadedState and RootState types on every files
 * @param preloadedState 
 * @returns 
 */

export function createPreloadedState(preloadedState: PreloadedState<RootState>) {
  return preloadedState
}
