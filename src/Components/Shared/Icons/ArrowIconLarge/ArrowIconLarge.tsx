interface Props {
  className?: string
}

function ArrowIconLarge({ className }: Props) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
      <path fill="currentColor" d="m12 15.4l-6-6L7.4 8l4.6 4.6L16.6 8L18 9.4l-6 6Z"></path>
    </svg>
  )
}

export default ArrowIconLarge