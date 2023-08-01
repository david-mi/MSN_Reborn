import { fireEvent, waitFor } from "@testing-library/react";
import LoginForm from "./LoginForm";
import { renderWithProviders } from "@/tests/utils";
import { EmailValidation, PasswordValidation } from "@/utils/Validation";
import { Emulator } from "@/tests/Emulator/Emulator";

const passwordValidation = new PasswordValidation()

describe("LoginForm", () => {
  describe("Validation", () => {
    it("should display the correct errors for empty email and password fields", async () => {
      const { queryAllByText, getByTestId } = renderWithProviders(<LoginForm />)
      const submitButton = getByTestId("login-submit-button");

      fireEvent.click(submitButton)

      await waitFor(() => {
        const errorsElemenst = queryAllByText(EmailValidation.errorsMessages.REQUIRED);
        expect(errorsElemenst).toHaveLength(2);
        expect(submitButton).toBeDisabled()
      });
    });

    it("should display the correct error for an invalid email", async () => {
      const { getByText, getByTestId } = renderWithProviders(<LoginForm />)
      const emailInput = getByTestId("login-email-input")
      fireEvent.change(emailInput, {
        target: {
          value: "not an email"
        }
      })
      const submitButton = getByTestId("login-submit-button");
      fireEvent.click(submitButton)

      await waitFor(() => {
        const errorElement = getByText(EmailValidation.errorsMessages.INVALID);
        expect(errorElement).toBeInTheDocument();
        expect(submitButton).toBeDisabled()
      });
    });

    it("should display the correct error for an invalid password", async () => {
      const { getByText, getByTestId } = renderWithProviders(<LoginForm />)
      const passwordInput = getByTestId("login-password-input")
      fireEvent.change(passwordInput, {
        target: {
          value: "badpassword"
        }
      })
      const submitButton = getByTestId("login-submit-button");
      fireEvent.click(submitButton)

      await waitFor(() => {
        const errorElement = getByText(passwordValidation.errorsMessages.INVALID);
        expect(errorElement).toBeInTheDocument();
        expect(submitButton).toBeDisabled()
      });
    });
  })

  describe("Existing account", () => {
    let email: string
    let password: string

    beforeAll(async () => {
      ({ email, password } = await Emulator.createUser({ setProfile: true, verify: true }))
      await Emulator.disconnectCurrentUser()
    })

    afterAll(async () => {
      await Emulator.deleteCurrentUser()
    })

    it("should submit form for an existing account", async () => {
      const { getByTestId } = renderWithProviders(<LoginForm />)

      const emailInput = getByTestId("login-email-input")
      fireEvent.change(emailInput, {
        target: {
          value: email
        }
      })

      const passwordInput = getByTestId("login-password-input")
      fireEvent.change(passwordInput, {
        target: {
          value: password
        }
      })

      const submitButton = getByTestId("login-submit-button");
      fireEvent.click(submitButton)

      const submitErrorElement = getByTestId("login-submit-error")

      await waitFor(() => {
        expect(Emulator.currentUser.email).toBe(email)
        expect(submitErrorElement).toBeEmptyDOMElement()
      })
    })
  })

  describe("Non existing account", () => {
    it("should submit form for an existing account", async () => {
      const { getByTestId, getByText } = renderWithProviders(<LoginForm />)

      const emailInput = getByTestId("login-email-input")
      fireEvent.change(emailInput, {
        target: {
          value: "user-that-doesnt-exist@bing.uk"
        }
      })

      const passwordInput = getByTestId("login-password-input")
      fireEvent.change(passwordInput, {
        target: {
          value: "superPassword12334!!"
        }
      })

      const submitButton = getByTestId("login-submit-button");
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(() => {
          Emulator.currentUser;
        }).toThrow();
        const errorElement = getByText("Firebase: Error (auth/user-not-found).");
        expect(errorElement).toBeInTheDocument();
      });
    })
  })
})