import React, { PropsWithChildren } from 'react'
import { Provider } from 'react-redux'
import { setupStore, AppStore, RootState } from "@/redux/store"
import type { PreloadedState } from '@reduxjs/toolkit'
import { RenderOptions, render, waitFor, waitForOptions } from '@testing-library/react'

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

/**
 * Verify that something doesn't occurs
 * 
 * @param callback negative assertions
 * @example
 * expectNeverOccurs(() => {
 * // verify 
    const errorElement = getByTestId("register-email-error")
    expect(errorElement).toHaveTextContent(/.+/)
  })
 */

export async function expectNeverOccurs(callback: () => void, options?: waitForOptions) {
  await expect(
    waitFor(callback, options)
  ).rejects.toThrow();
}