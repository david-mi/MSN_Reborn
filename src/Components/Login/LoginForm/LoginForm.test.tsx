import { fireEvent, waitFor } from "@testing-library/react";
import LoginForm from "./LoginForm";
import { renderWithProviders } from "@/tests/utils";
import { EmailValidation, PasswordValidation } from "@/utils/Validation";
import { AuthEmulator } from "@/tests/Emulator/AuthEmulator";

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
    const email = "plafond-solution@yahoo.fr"
    const password = "superPassw0rd!12"

    beforeAll(async () => {
      await AuthEmulator.createAndVerifyUser(email, password)
      await AuthEmulator.setUserProfile({
        avatarSrc: "avatar.jpg",
        username: "Erwan Plafond"
      })
      await AuthEmulator.disconnectCurrentUser()
    })

    afterAll(async () => {
      await AuthEmulator.deleteCurrentUser()
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
        expect(AuthEmulator.currentUser.email).toBe(email)
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
          AuthEmulator.currentUser;
        }).toThrow();
        const errorElement = getByText("Firebase: Error (auth/user-not-found).");
        expect(errorElement).toBeInTheDocument();
      });
    })
  })
})