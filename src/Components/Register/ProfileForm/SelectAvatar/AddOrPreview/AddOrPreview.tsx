import { ChangeEvent } from "react"
import Avatar from "@/Components/Shared/Avatar/Avatar";
import styles from "./addOrPreview.module.css";
import AddImageIcon from "@/Components/Shared/Icons/AddImageIcon/AddImageIcon";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { setBase64Avatar } from "@/redux/slices/register/register";

function AddOrPreview() {
  const avatarSrc = useAppSelector(({ register }) => register.user.avatarSrc)
  const dispatch = useAppDispatch()

  function handleChange({ target }: ChangeEvent<HTMLInputElement>) {
    const addedFile = (target.files as FileList)[0]

    dispatch(setBase64Avatar(addedFile))
  }

  return (
    <label htmlFor="avatar-add" className={styles.previewLabel}>
      <Avatar
        src={avatarSrc}
        size="medium"
        className={styles.avatar}
      />
      <AddImageIcon />
      <input
        type="file"
        className={styles.addFileInput}
        id="avatar-add"
        onChange={handleChange}
      />
    </label>
  );
}

export default AddOrPreview;