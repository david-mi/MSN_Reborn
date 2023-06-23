import { render, fireEvent, waitFor } from "@testing-library/react";
import EmailForm from "./EmailForm";
import { EmailValidation } from "@/Services/Validation";

let emailValidation: EmailValidation

beforeEach(() => {
  emailValidation = new EmailValidation()
})

it("should display the correct error for an empty string", async () => {
  const { getByText } = render(<EmailForm />);
  const submitButton = getByText("Suivant");
  fireEvent.click(submitButton)

  await waitFor(() => {
    const errorElement = getByText(emailValidation.errorsMessages.REQUIRED);
    expect(errorElement).toBeInTheDocument();
    expect(submitButton).toBeDisabled()
  });
});

it("should display the correct error for an invalid email", async () => {
  const { getByText, getByRole } = render(<EmailForm />);
  const inputElement = getByRole("textbox")
  fireEvent.change(inputElement, {
    target: {
      value: "not an email"
    }
  })
  const submitButton = getByText("Suivant");
  fireEvent.click(submitButton)

  await waitFor(() => {
    const errorElement = getByText(emailValidation.errorsMessages.INVALID);
    expect(errorElement).toBeInTheDocument();
    expect(submitButton).toBeDisabled()
  });
});
