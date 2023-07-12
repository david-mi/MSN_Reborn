import { fireEvent, waitFor } from "@testing-library/react";
import EmailForm from "./EmailForm";
import { renderWithProviders, expectNeverOccurs } from "@/tests/utils";
import { EmailValidation } from "@/utils/Validation";

describe("EmailForm", () => {
  it("should display the correct error for an empty string", async () => {
    const { getByText, getByTestId } = renderWithProviders(<EmailForm />)
    const submitButton = getByText("Suivant");
    const emailInput = getByTestId("register-email-input")
    fireEvent.change(emailInput, {
      target: {
        value: ""
      }
    })
    fireEvent.click(submitButton)

    await waitFor(() => {
      const errorElement = getByText(EmailValidation.errorsMessages.REQUIRED);
      expect(errorElement).toBeInTheDocument();
      expect(submitButton).toBeDisabled()
    });
  });

  it("should display the correct error for an invalid email", async () => {
    const { getByText, getByTestId } = renderWithProviders(<EmailForm />)
    const emailInput = getByTestId("register-email-input")
    fireEvent.change(emailInput, {
      target: {
        value: "not an email"
      }
    })
    const submitButton = getByTestId("register-email-submit-button");
    fireEvent.click(submitButton)

    await waitFor(() => {
      const errorElement = getByText(EmailValidation.errorsMessages.INVALID);
      expect(errorElement).toBeInTheDocument();
      expect(submitButton).toBeDisabled()
    });

  });

  it("should submit the form with a valid email and without displaying any errors", async () => {
    const { getByTestId } = renderWithProviders(<EmailForm />)
    const emailInput = getByTestId("register-email-input")
    fireEvent.change(emailInput, {
      target: {
        value: "validEmail@gmail.com"
      }
    })
    const submitButton = getByTestId("register-email-submit-button");

    expect(submitButton).not.toBeDisabled()
    fireEvent.click(submitButton)

    expectNeverOccurs(() => {
      const errorElement = getByTestId("register-email-error")
      expect(errorElement).toHaveTextContent(/.+/)
    })
  });
})