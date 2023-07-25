import { ChangeEvent, useEffect } from "react"
import { Avatar, AddImageIcon } from "@/Components/Shared";
import { useFormContext } from "react-hook-form";
import { ProfileValidation } from "@/utils/Validation/";
import { convertFileToBase64 } from "@/utils/convertFileToBase64";
import styles from "./addOrPreview.module.css";
import type { UserProfile } from "@/redux/slices/user/types";

function AddOrPreview() {
  const { setError, setValue, watch, clearErrors, register } = useFormContext<Pick<UserProfile, "avatarSrc">>()
  const avatarSrc = watch("avatarSrc")

  async function handleChange({ target }: ChangeEvent<HTMLInputElement>) {
    const addedFile = (target.files as FileList)[0]
    const avatarValidation = ProfileValidation.validateAvatar(addedFile)

    if (typeof avatarValidation === "string") {
      setError("avatarSrc", { message: avatarValidation })
    } else {
      const base64Avatar = await convertFileToBase64(addedFile)
      clearErrors("avatarSrc")
      setValue("avatarSrc", base64Avatar)
    }
  }

  useEffect(() => {
    register("avatarSrc", { required: ProfileValidation.errorsMessages.avatar.REQUIRED })
  }, [register])

  return (
    <label htmlFor="avatar-add" className={styles.previewLabel}>
      <Avatar
        src={avatarSrc}
        size="medium"
        className={styles.avatar}
      />
      <AddImageIcon />
      <input
        data-testid="register-profile-avatar-input"
        type="file"
        className={styles.addFileInput}
        id="avatar-add"
        onChange={handleChange}
      />
    </label>
  );
}

export default AddOrPreview;