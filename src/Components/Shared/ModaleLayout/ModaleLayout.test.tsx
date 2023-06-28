import { render } from "@testing-library/react";
import ModaleLayout, { Props } from "./ModaleLayout";

const childrenTestId = "modale-layout-test"
const modaleLayoutProps: Props = {
  children: <p data-testid={childrenTestId}>this is a test</p>,
  title: "Test title"
}

describe("ModaleLayout", () => {
  it("should display the title from props", () => {
    const { getByText } = render(<ModaleLayout {...modaleLayoutProps} />);
    const titleElement = getByText(modaleLayoutProps.title);
    expect(titleElement).toBeInTheDocument();
  });

  it("should display the children from props", () => {
    const { getByTestId } = render(<ModaleLayout {...modaleLayoutProps} />);
    const childrenElement = getByTestId(childrenTestId);
    expect(childrenElement).toBeInTheDocument();
  });
});
