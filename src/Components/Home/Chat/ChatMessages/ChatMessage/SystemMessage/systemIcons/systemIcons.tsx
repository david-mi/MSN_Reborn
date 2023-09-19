import styles from "./systemIcons.module.css"

export const systemIcons = {
  ":arrow_leave:": (
    <svg xmlns="http://www.w3.org/2000/svg" color="red" width="1.4em" height="1.4em" viewBox="0 0 24 24">
      <path fill="currentColor" d="m10 18l-6-6l6-6l1.4 1.45L7.85 11H20v2H7.85l3.55 3.55L10 18Z" > </path>
    </svg >
  ),
  ":arrow_join:": (
    <svg xmlns="http://www.w3.org/2000/svg" color="green" width="1.4em" height="1.4em" viewBox="0 0 24 24">
      <path fill="currentColor" d="m14 18l-1.4-1.45L16.15 13H4v-2h12.15L12.6 7.45L14 6l6 6l-6 6Z"></path>
    </svg>
  ),
  ":admin_star:": (
    <svg className={styles.admin} xmlns="http://www.w3.org/2000/svg" color="yellow" width="1.6em" height="1.6em" viewBox="0 0 24 24">
      <path fill="currentColor" d="m5.825 22l2.325-7.6L2 10h7.6L12 2l2.4 8H22l-6.15 4.4l2.325 7.6L12 17.3L5.825 22Z"></path>
    </svg>
  )
}

