import { fireEvent, waitFor } from "@testing-library/react";
import PasswordForm from "./PasswordForm";
import { PasswordValidation } from "@/utils/Validation";
import { deleteCurrentUserFromEmulator, renderWithProviders } from "@/tests/utils";
import { initialUserState } from "@/redux/slices/user/user";
import { RootState } from "@/redux/store";

describe("PasswordForm", () => {
  let passwordValidation: PasswordValidation;
  let preloadedStateAfterProfileStep: RootState

  beforeEach(() => {
    passwordValidation = new PasswordValidation();
    preloadedStateAfterProfileStep = {

      user: {
        ...initialUserState
      },
      register: {
        user: {
          email: "user-register-mock@gmail.com",
          password: "",
          username: "user-test",
          avatarSrc: "avatartest.jpg"
        },
        step: "PASSWORD",
        submitStatus: "IDLE",
        submitError: null,
        profile: {
          defaultAvatars: [],
          getDefaultAvatarsStatus: "PENDING",
          getDefaultAvatarsError: null
        }
      }
    };
  });

  afterAll(async () => {
    await deleteCurrentUserFromEmulator()
  })

  it("should display the correct error for an empty password field", async () => {
    const { getByTestId } = renderWithProviders(<PasswordForm />, { preloadedState: preloadedStateAfterProfileStep });

    const passwordInput = getByTestId("register-password-input");
    fireEvent.change(passwordInput, { target: { value: "" } });

    const submitButton = getByTestId("register-password-submit-button")
    fireEvent.click(submitButton)

    await waitFor(() => {
      const errorElement = getByTestId("register-password-error");
      expect(errorElement).toHaveTextContent(passwordValidation.errorsMessages.REQUIRED);
    });
  });

  it("should display the correct error for an invalid password", async () => {
    const { getByTestId } = renderWithProviders(<PasswordForm />, { preloadedState: preloadedStateAfterProfileStep });

    const passwordInput = getByTestId("register-password-input");
    fireEvent.change(passwordInput, { target: { value: "mypassword" } });

    const submitButton = getByTestId("register-password-submit-button")
    fireEvent.click(submitButton)

    await waitFor(() => {
      const errorElement = getByTestId("register-password-error");
      expect(errorElement).toHaveTextContent(passwordValidation.errorsMessages.INVALID);
    });
  });

  it("should display the correct error when passwords do not match", async () => {
    const { getByTestId } = renderWithProviders(<PasswordForm />, { preloadedState: preloadedStateAfterProfileStep });

    const passwordInput = getByTestId("register-password-input");
    fireEvent.change(passwordInput, { target: { value: "validPassword" } });

    const confirmPasswordInput = getByTestId("register-password-confirm-input");
    fireEvent.change(confirmPasswordInput, { target: { value: "differentPassword" } });

    const submitButton = getByTestId("register-password-submit-button")
    fireEvent.click(submitButton)

    await waitFor(() => {
      const errorElement = getByTestId("register-password-confirm-error");
      expect(errorElement).toHaveTextContent(passwordValidation.errorsMessages.INVALID);
    });
  });

  it("should submit the form with valid passwords and without displaying any errors", async () => {
    const { getByTestId, store } = renderWithProviders(<PasswordForm />, { preloadedState: preloadedStateAfterProfileStep });

    const passwordInput = getByTestId("register-password-input");
    fireEvent.change(passwordInput, { target: { value: "validPassword123!" } });

    const confirmPasswordInput = getByTestId("register-password-confirm-input");
    fireEvent.change(confirmPasswordInput, { target: { value: "validPassword123!" } });

    const submitButton = getByTestId("register-password-submit-button")
    fireEvent.click(submitButton)

    await waitFor(() => {
      const storeState = store.getState()
      expect(storeState.register.step).toEqual("SEND_VERIFICATION_EMAIL")
    });
  });
});
