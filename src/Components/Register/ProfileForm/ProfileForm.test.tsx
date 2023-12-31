import { fireEvent, waitFor, getByTestId, getByText } from "@testing-library/react";
import ProfileForm from "./ProfileForm";
import { ProfileValidation } from "@/utils/Validation";
import { expectNeverOccurs, renderWithProviders } from "@/tests/utils";
import { RootState } from "@/redux/store";
import type { Store } from "@/redux/types";
import { initialUserState } from "@/redux/slices/user/user";
import { initialLoginState } from "@/redux/slices/login/login";
import { initialContactState } from "@/redux/slices/contact/contact";
import { initialChatState } from "@/redux/slices/room/room";
import { initialNotificationState } from "@/redux/slices/notification/notification";
import { initialOptionsState } from "@/redux/slices/options/options";

const { body } = document

describe("ProfileForm", () => {
  let preloadedStateAfterEmailStep: RootState
  const base64Str = "base64"
  let avatarElement: HTMLImageElement
  let avatarInput: HTMLInputElement
  let usernameInput: HTMLInputElement
  let submitButton: HTMLButtonElement
  let store: Store

  beforeEach(() => {
    preloadedStateAfterEmailStep = {
      register: {
        userData: {
          email: "user-register-mock@gmail.com",
          password: "",
          username: "",
          avatarSrc: ""
        },
        step: "PROFILE",
        request: {
          status: "IDLE",
          error: null
        },
        defaultAvatars: [],
        getDefaultAvatarsRequest: {
          status: "IDLE",
          error: null
        }
      },
      login: {
        ...initialLoginState
      },
      user: {
        ...initialUserState
      },
      contact: {
        ...initialContactState
      },
      room: {
        ...initialChatState
      },
      notification: {
        ...initialNotificationState
      },
      options: {
        ...initialOptionsState
      }
    };

    ({ store } = renderWithProviders(<ProfileForm />, { preloadedState: preloadedStateAfterEmailStep }))
    submitButton = getByTestId(body, "register-profile-submit-button") as HTMLButtonElement
    avatarElement = getByTestId(body, "avatar-img") as HTMLImageElement
    usernameInput = getByTestId(body, "register-profile-username-input") as HTMLInputElement
    avatarInput = getByTestId(body, "register-profile-avatar-input") as HTMLInputElement;
    submitButton = getByTestId(body, "register-profile-submit-button") as HTMLButtonElement
  });

  it("should display the correct error for an invalid avatar", async () => {
    fireEvent.change(avatarInput, {
      target: {
        files: [new File([], "avatar.txt", { type: "text/plain" })],
      },
    });

    await expectNeverOccurs(() => {
      expect(avatarElement.src).toContain(base64Str)
    }, { timeout: 100 })

    fireEvent.click(submitButton);

    /** Submit is asynchronous with react-hook-form, so we have to wait */
    await waitFor(() => {
      const errorElement = getByText(body, ProfileValidation.errorsMessages.avatar.WRONG_FORMAT);
      expect(errorElement).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
    });
  });

  it("should display the correct error for an invalid username", async () => {
    fireEvent.change(usernameInput, {
      target: {
        value: "a",
      },
    });

    fireEvent.click(submitButton);

    await waitFor(() => {
      const errorElement = getByText(body, ProfileValidation.errorsMessages.username.OUTSIDE_SIZE_RANGE);
      expect(errorElement).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
    });
  });

  it("should display the correct error for a valid avatar but invalid username", async () => {
    fireEvent.change(avatarInput, {
      target: {
        files: [new File([], "avatar.jpg", { type: "image/jpeg" })],
      },
    });

    await waitFor(() => {
      expect(avatarElement.src).toContain(base64Str)
    }, { timeout: 100 })

    fireEvent.change(usernameInput, {
      target: {
        value: "a",
      },
    });

    fireEvent.click(submitButton);

    await waitFor(() => {
      const errorElement = getByText(body, ProfileValidation.errorsMessages.username.OUTSIDE_SIZE_RANGE);
      expect(errorElement).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
    });
  });

  it("should display the correct error for a valid username but invalid avatar", async () => {
    fireEvent.change(avatarInput, {
      target: {
        files: [new File([], "avatar.txt", { type: "text/plain" })],
      },
    });

    await expectNeverOccurs(() => {
      expect(avatarElement.src).toContain(base64Str)
    }, { timeout: 100 })

    fireEvent.change(usernameInput, {
      target: {
        value: "validUsername",
      },
    });

    fireEvent.click(submitButton);

    await waitFor(() => {
      const errorElement = getByText(body, ProfileValidation.errorsMessages.avatar.WRONG_FORMAT);
      expect(errorElement).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
    });
  });

  it("should display the correct error for a valid avatar but invalid username", async () => {
    fireEvent.change(avatarInput, {
      target: {
        files: [new File([""], "file.png", { type: "image/png" })],
      },
    });

    await waitFor(() => {
      expect(avatarElement.src).toContain(base64Str)
    }, { timeout: 100 })

    fireEvent.change(usernameInput, {
      target: {
        value: "d",
      },
    });

    fireEvent.click(submitButton);

    await waitFor(() => {
      const errorElement = getByText(body, ProfileValidation.errorsMessages.username.OUTSIDE_SIZE_RANGE);
      expect(errorElement).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
    });
  });

  it("should submit the form with valid inputs", async () => {
    fireEvent.change(avatarInput, {
      target: {
        files: [new File([""], "file.png", { type: "image/png" })],
      },
    });

    await waitFor(() => {
      expect(avatarElement.src).toContain(base64Str)
    }, { timeout: 100 })

    fireEvent.change(usernameInput, {
      target: {
        value: "validUsername",
      },
    });

    expect(submitButton).not.toBeDisabled()
    fireEvent.click(submitButton)

    await waitFor(() => {
      const storeState = store.getState()
      expect(storeState.register.step).toEqual("PASSWORD")
    })
  });
})