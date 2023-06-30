import { ChangeEvent } from "react"
import Avatar from "@/Components/Shared/Avatar/Avatar";
import styles from "./addOrPreview.module.css";
import AddImageIcon from "@/Components/Shared/Icons/AddImageIcon/AddImageIcon";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { setBase64Avatar, resetAvatarSrc } from "@/redux/slices/register/register";
import { useFormContext } from "react-hook-form";
import { ProfileValidation } from "@/utils/Validation/ProfileValidation/ProfileValidation";
import type { ProfileFormFields } from "../../ProfileForm";

const profileValidation = new ProfileValidation()

function AddOrPreview() {
  const avatarSrc = useAppSelector(({ register }) => register.user.avatarSrc)
  const dispatch = useAppDispatch()
  const { register, setError, clearErrors } = useFormContext<ProfileFormFields>()

  function handleFileValidate({ target }: ChangeEvent<HTMLInputElement>) {
    const addedFile = (target.files as FileList)[0]
    const avatarValidation = profileValidation.validateAvatar(addedFile)

    if (typeof avatarValidation === "string") {
      setError("avatarSrc", { message: avatarValidation })
      dispatch(resetAvatarSrc())
    } else {
      clearErrors("avatarSrc")
      dispatch(setBase64Avatar(addedFile))
    }
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
        {...register("avatarSrc", { onChange: handleFileValidate })}
      />
    </label>
  );
}

export default AddOrPreview;