import { render, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import Button from "./Button";
import styles from "./button.module.css"

describe("Button", () => {
  it("should render the button with the correct title", () => {
    const title = "Next";
    const { getByText } = render(<Button title={title} theme="monochrome" />);
    const buttonElement = getByText(title);
    expect(buttonElement).toBeInTheDocument();
  });

  it("should apply the correct CSS classes", () => {
    const { container } = render(<Button title="Test" theme="gradient" />);
    const buttonElement = container.firstChild;
    expect(buttonElement).toHaveClass(styles.button, styles.gradient);
  });

  it("should apply every passed props attributes", () => {
    const onClickMock = vi.fn();
    const { container } = render(
      <Button
        title="Test"
        theme="monochrome"
        data-button="button"
        onClick={onClickMock}
      />
    );

    const button = container.firstChild!

    fireEvent.click(button)
    expect(onClickMock).toBeCalled()
    expect(button).toHaveAttribute("data-button", "button")
  });
});