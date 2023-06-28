import { render } from "@testing-library/react";
import Avatar from "./Avatar";
import styles from "./avatar.module.css"

describe("Avatar", () => {
  it("should apply the correct CSS classes", () => {
    const { container } = render(<Avatar size="medium" />);
    const avatarElement = container.firstChild!

    expect(avatarElement).toHaveClass(styles.avatar, styles.medium);
  });

  it("should apply the correct CSS classes", () => {
    const { container } = render(<Avatar size="small" />);
    const avatarElement = container.firstChild!

    expect(avatarElement).toHaveClass(styles.avatar, styles.small);
  });
});