import { fireEvent, render } from "@testing-library/react"
import ImageLoadWrapper, { Props } from "./ImageLoadWrapper"
import { vi } from "vitest"
import type { ComponentProps } from "react"

describe("ImageLoadWrapper", () => {
  it("should set wrapper tag as a div if not wrapperTagName props was given", () => {
    const props: Props<"button"> = {
      imageProps: {
        src: "image.jpg"
      },
    }

    const { container } = render(<ImageLoadWrapper {...props} />)

    expect(container.children[0].tagName).toBe("DIV")
  })

  it("should set the correct wrapper tag, based on wrapperTagName props", () => {
    const props: Props<"button"> = {
      imageProps: {
        src: "image.jpg"
      },
      wrapperTagName: "button"
    }

    const { container } = render(<ImageLoadWrapper {...props} />)
    const wrapper = container.children[0]

    expect(wrapper.tagName).toBe("BUTTON")
  })

  it("should set the correct wrapper tag, based on wrapperTagName props", async () => {
    const onWrapperClick = vi.fn()
    const props: Props<"button"> = {
      imageProps: {
        src: "image.jpg"
      },
      wrapperTagName: "button",
      wrapperProps: {
        onClick: onWrapperClick,
        id: "customId",
        ["data-custom-test" as keyof ComponentProps<"button">]: "test"
      }
    }

    const { container } = render(<ImageLoadWrapper {...props} />)
    const wrapper = container.children[0]
    fireEvent.click(wrapper)

    expect(onWrapperClick).toHaveBeenCalled()
    expect(wrapper).toHaveAttribute("data-custom-test", "test")
    expect(wrapper).toHaveAttribute("id", "customId")
  })
})