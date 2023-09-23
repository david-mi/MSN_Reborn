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
  ),
  ":wizz:": (
    <svg xmlns="http://www.w3.org/2000/svg" color="#0088e0" width="1.4em" height="1.4em" viewBox="0 0 24 24">
      <path fill="currentColor" d="M4 19v-2h2v-7q0-2.075 1.25-3.688T10.5 4.2v-.7q0-.625.438-1.063T12 2q.625 0 1.063.438T13.5 3.5v.7q2 .5 3.25 2.113T18 10v7h2v2H4Zm8 3q-.825 0-1.413-.588T10 20h4q0 .825-.588 1.413T12 22ZM2 10q0-2.5 1.113-4.588T6.1 1.95l1.175 1.6q-1.5 1.1-2.388 2.775T4 10H2Zm18 0q0-2-.888-3.675T16.726 3.55l1.175-1.6q1.875 1.375 2.988 3.463T22 10h-2Z"></path>
    </svg>
  )
}

