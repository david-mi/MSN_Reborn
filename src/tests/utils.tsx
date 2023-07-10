import React, { PropsWithChildren } from 'react'
import { Provider } from 'react-redux'
import { setupStore, AppStore, RootState } from "@/redux/store"
import type { PreloadedState } from '@reduxjs/toolkit'
import { RenderOptions, render, waitFor, waitForOptions } from '@testing-library/react'
import { firebase } from "@/firebase/config"
import { createUserWithEmailAndPassword, sendEmailVerification, applyActionCode } from "firebase/auth"
import { doc, deleteDoc } from "firebase/firestore"

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

export async function deleteAllUsersFromEmulator() {
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID
  const fetchUrl = `http://127.0.0.1:9099/emulator/v1/projects/${projectId}/accounts`

  await fetch(fetchUrl, { method: "DELETE" })
}

export async function deleteCurrentUserFromEmulator() {
  const currentUser = firebase.auth.currentUser

  if (currentUser === null) return

  const userId = currentUser?.uid
  const userProfileRef = doc(firebase.firestore, `users/${userId}`)

  await currentUser.delete()
  await deleteDoc(userProfileRef)
}

export async function createUserOnEmulator(email: string) {
  const password = "myP@ssworD!"

  await createUserWithEmailAndPassword(firebase.auth, email, password)
}

export async function getOobCodeForEmail(email: string) {
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID
  const response = await fetch(`http://127.0.0.1:9099/emulator/v1/projects/${projectId}/oobCodes`)
  const oobCodeDetails = await response.json()

  const foundOobDetails = oobCodeDetails.oobCodes.find((details: any) => {
    return (
      details.email === email &&
      details.requestType === "VERIFY_EMAIL"
    )
  })

  return foundOobDetails.oobCode
}

export async function createAndVerifyUser(email: string) {
  await createUserOnEmulator(email)
  await sendEmailVerification(firebase.auth.currentUser!)
  const oobCode = await getOobCodeForEmail(email)
  await applyActionCode(firebase.auth, oobCode)
}