import { renderWithProviders } from "@/tests/utils";
import { routesConfig } from "./Routes";
import { createMemoryRouter } from "react-router-dom";
import { RouterProvider } from "react-router-dom"
import { AuthEmulator } from "@/tests/Emulator/AuthEmulator";

describe("Unauthenticated user", () => {
  it("should give access to '/login'", async () => {
    const router = createMemoryRouter(routesConfig, {
      initialEntries: ["/login"]
    })

    const { findByTestId } = renderWithProviders(<RouterProvider router={router} />)

    const loginPageContainer = await findByTestId("login")
    expect(loginPageContainer).toBeInTheDocument()
  })

  it("should give access to '/register'", async () => {
    const router = createMemoryRouter(routesConfig, {
      initialEntries: ["/register"]
    })

    const { findByTestId } = renderWithProviders(<RouterProvider router={router} />)

    const registerPageContainer = await findByTestId("register")
    expect(registerPageContainer).toBeInTheDocument()
  })

  it("should give access to '/verify-account'", async () => {
    const router = createMemoryRouter(routesConfig, {
      initialEntries: ["/verify-account"]
    })

    const { findByTestId } = renderWithProviders(<RouterProvider router={router} />)

    const verifyAccountPageContainer = await findByTestId("verify-account")
    expect(verifyAccountPageContainer).toBeInTheDocument()
  })

  it("should redirect to '/login' when trying to access '/'", async () => {
    const router = createMemoryRouter(routesConfig, {
      initialEntries: ["/"]
    })

    const { findByTestId } = renderWithProviders(<RouterProvider router={router} />)

    const loginPageContainer = await findByTestId("login")
    expect(loginPageContainer).toBeInTheDocument()
  })

  it("should redirect to '/login' when trying to access '/send-email-verification'", async () => {
    const router = createMemoryRouter(routesConfig, {
      initialEntries: ["/send-email-verification"]
    })

    const { findByTestId } = renderWithProviders(<RouterProvider router={router} />)

    const homePageContainer = await findByTestId("login")
    expect(homePageContainer).toBeInTheDocument()
  })
})


describe("Authenticated user", () => {
  beforeAll(async () => {
    await AuthEmulator.createUser("routes-user@gmail.com")
  })

  afterAll(async () => {
    await AuthEmulator.deleteCurrentUser()
  })

  describe("Unverified user", () => {
    it("should give access to '/send-email-verification'", async () => {
      const router = createMemoryRouter(routesConfig, {
        initialEntries: ["/send-email-verification"]
      })

      const { findByTestId } = renderWithProviders(<RouterProvider router={router} />)

      const sendEmailVerificationPageContainer = await findByTestId("send-email-verification")
      expect(sendEmailVerificationPageContainer).toBeInTheDocument()
    })

    it("should give access to '/verify-account'", async () => {
      const router = createMemoryRouter(routesConfig, {
        initialEntries: ["/verify-account"]
      })

      const { findByTestId } = renderWithProviders(<RouterProvider router={router} />)

      const verifyAccountPageContainer = await findByTestId("verify-account")
      expect(verifyAccountPageContainer).toBeInTheDocument()
    })

    it("should redirect to '/send-email-verification' when trying to access '/'", async () => {
      const router = createMemoryRouter(routesConfig, {
        initialEntries: ["/"]
      })

      const { findByTestId } = renderWithProviders(<RouterProvider router={router} />)

      const sendEmailVerificationPageContainer = await findByTestId("send-email-verification")
      expect(sendEmailVerificationPageContainer).toBeInTheDocument()
    })

    it("should redirect to '/send-email-verification' when trying to access '/login'", async () => {
      const router = createMemoryRouter(routesConfig, {
        initialEntries: ["/login"]
      })

      const { findByTestId } = renderWithProviders(<RouterProvider router={router} />)

      const sendEmailVerificationPageContainer = await findByTestId("send-email-verification")
      expect(sendEmailVerificationPageContainer).toBeInTheDocument()
    })

    it("should redirect to '/send-email-verification' when trying to access '/register'", async () => {
      const router = createMemoryRouter(routesConfig, {
        initialEntries: ["/register"]
      })

      const { findByTestId } = renderWithProviders(<RouterProvider router={router} />)

      const sendEmailVerificationPageContainer = await findByTestId("send-email-verification")
      expect(sendEmailVerificationPageContainer).toBeInTheDocument()
    })
  })

  describe("Verified user", () => {
    beforeAll(async () => {
      await AuthEmulator.verifyCurrentUser()
    })

    it("should give access to '/'", async () => {
      const router = createMemoryRouter(routesConfig, {
        initialEntries: ["/"]
      })

      const { findByTestId } = renderWithProviders(<RouterProvider router={router} />)

      const homePageContainer = await findByTestId("home")
      expect(homePageContainer).toBeInTheDocument()
    })

    it("should give access to '/verify-account'", async () => {
      const router = createMemoryRouter(routesConfig, {
        initialEntries: ["/verify-account"]
      })

      const { findByTestId } = renderWithProviders(<RouterProvider router={router} />)

      const verifyAccountPageContainer = await findByTestId("verify-account")
      expect(verifyAccountPageContainer).toBeInTheDocument()
    })

    it("should redirect to '/' when trying to access '/login'", async () => {
      const router = createMemoryRouter(routesConfig, {
        initialEntries: ["/login"]
      })

      const { findByTestId } = renderWithProviders(<RouterProvider router={router} />)

      const homePageContainer = await findByTestId("home")
      expect(homePageContainer).toBeInTheDocument()
    })

    it("should redirect to '/' when trying to access '/register'", async () => {
      const router = createMemoryRouter(routesConfig, {
        initialEntries: ["/register"]
      })

      const { findByTestId } = renderWithProviders(<RouterProvider router={router} />)

      const homePageContainer = await findByTestId("home")
      expect(homePageContainer).toBeInTheDocument()
    })

    it("should redirect to '/' when trying to access '/send-email-verification'", async () => {
      const router = createMemoryRouter(routesConfig, {
        initialEntries: ["/send-email-verification"]
      })

      const { findByTestId } = renderWithProviders(<RouterProvider router={router} />)

      const homePageContainer = await findByTestId("home")
      expect(homePageContainer).toBeInTheDocument()
    })
  })
})