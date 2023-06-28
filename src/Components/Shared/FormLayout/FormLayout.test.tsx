import { fireEvent, render } from "@testing-library/react";
import FormLayout, { Props } from "./FormLayout";
import { vi } from "vitest"

const childrenTestId = "modale-layout-test"
const formLayoutProps: Props = {
  children: <p data-testid={childrenTestId}>this is a test</p>,
  onSubmit: vi.fn()
}

describe("FormLayout", () => {
  it("should call onSubmit callback from props when submitting", () => {
    const { container } = render(<FormLayout {...formLayoutProps} />);
    const form = container.firstChild!
    fireEvent.submit(form)

    expect(formLayoutProps.onSubmit).toBeCalled()
  });

  it("should display the children from props", () => {
    const { getByTestId } = render(<FormLayout {...formLayoutProps} />);
    const childrenElement = getByTestId(childrenTestId);

    expect(childrenElement).toBeInTheDocument();
  });
});
