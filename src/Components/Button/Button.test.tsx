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

  it("should pass down other props to the underlying button component", () => {
    const onClickMock = vi.fn();
    const { getByTestId } = render(
      <Button
        title="Test"
        theme="monochrome"
        onClick={onClickMock}
      />
    );

    const button = getByTestId("button-rect")

    fireEvent.click(button)
    expect(onClickMock).toBeCalled()
  });
});