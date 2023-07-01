import { fireEvent, waitFor } from "@testing-library/react";
import ProfileForm from "./ProfileForm";
import { ProfileValidation } from "@/utils/Validation/ProfileValidation/ProfileValidation";
import { renderWithProviders } from "@/tests/utils";
import { RootState } from "@/redux/store";

let profileValidation: ProfileValidation;
let preloadedStateAfterEmailStep: RootState

beforeEach(() => {
  preloadedStateAfterEmailStep = {
    register: {
      user: {
        email: 'test@gmail.com',
        password: '',
        username: '',
        avatarSrc: ''
      },
      step: 'PROFILE',
      submitStatus: 'IDLE',
      profile: {
        defaultAvatars: [],
        getDefaultAvatarsStatus: 'PENDING',
        getDefaultAvatarsError: null
      }
    }
  }
  profileValidation = new ProfileValidation();
});

it("should display the correct error for an invalid avatar", async () => {
  const { getByText, getByTestId } = renderWithProviders(<ProfileForm />, { preloadedState: preloadedStateAfterEmailStep })
  const avatarInput = getByTestId("register-profile-avatar-input") as HTMLInputElement;
  fireEvent.change(avatarInput, {
    target: {
      files: [new File([], "avatar.txt", { type: "text/plain" })],
    },
  });
  const submitButton = getByTestId("register-profile-submit-button") as HTMLButtonElement
  fireEvent.click(submitButton);

  await waitFor(() => {
    const errorElement = getByText(profileValidation.errorsMessages.avatar.WRONG_FORMAT);
    expect(errorElement).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });
});

it("should display the correct error for an invalid username", async () => {
  const { getByText, getByTestId } = renderWithProviders(<ProfileForm />, { preloadedState: preloadedStateAfterEmailStep })
  const userNameInput = getByTestId("register-profile-username-input") as HTMLInputElement;
  fireEvent.change(userNameInput, {
    target: {
      value: "a",
    },
  });
  const submitButton = getByTestId("register-profile-submit-button") as HTMLButtonElement
  fireEvent.click(submitButton);

  await waitFor(() => {
    const errorElement = getByText(profileValidation.errorsMessages.username.OUTSIDE_SIZE_RANGE);
    expect(errorElement).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });
});

it("should display the correct error for a valid avatar but invalid username", async () => {
  const { getByText, getByTestId } = renderWithProviders(<ProfileForm />, { preloadedState: preloadedStateAfterEmailStep });
  const avatarInput = getByTestId("register-profile-avatar-input") as HTMLInputElement;
  const usernameInput = getByTestId("register-profile-username-input") as HTMLInputElement;
  const submitButton = getByTestId("register-profile-submit-button") as HTMLButtonElement;

  fireEvent.change(avatarInput, {
    target: {
      files: [new File([], "avatar.jpg", { type: "image/jpeg" })],
    },
  });

  fireEvent.change(usernameInput, {
    target: {
      value: "a",
    },
  });

  fireEvent.click(submitButton);

  await waitFor(() => {
    const errorElement = getByText(profileValidation.errorsMessages.username.OUTSIDE_SIZE_RANGE);
    expect(errorElement).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });
});

it("should display the correct error for a valid username but invalid avatar", async () => {
  const { getByText, getByTestId } = renderWithProviders(<ProfileForm />, { preloadedState: preloadedStateAfterEmailStep });
  const avatarInput = getByTestId("register-profile-avatar-input") as HTMLInputElement;
  const usernameInput = getByTestId("register-profile-username-input") as HTMLInputElement;
  const submitButton = getByTestId("register-profile-submit-button") as HTMLButtonElement;

  fireEvent.change(avatarInput, {
    target: {
      files: [new File([], "avatar.txt", { type: "text/plain" })],
    },
  });

  fireEvent.change(usernameInput, {
    target: {
      value: "validUsername",
    },
  });

  fireEvent.click(submitButton);

  await waitFor(() => {
    const errorElement = getByText(profileValidation.errorsMessages.avatar.WRONG_FORMAT);
    expect(errorElement).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });
});

it("should submit the form with valid inputs", async () => {
  const { getByTestId } = renderWithProviders(<ProfileForm />, { preloadedState: preloadedStateAfterEmailStep })

  const avatarInput = getByTestId("register-profile-avatar-input") as HTMLInputElement;
  const usernameInput = getByTestId("register-profile-username-input") as HTMLInputElement;
  const submitButton = getByTestId("register-profile-submit-button") as HTMLButtonElement;

  fireEvent.change(avatarInput, {
    target: {
      files: [new File([], "avatar.jpg", { type: "image/jpeg" })],
    },
  });

  fireEvent.change(usernameInput, {
    target: {
      value: "validUsername",
    },
  });

  expect(submitButton).not.toBeDisabled()
  fireEvent.click(submitButton);
});
