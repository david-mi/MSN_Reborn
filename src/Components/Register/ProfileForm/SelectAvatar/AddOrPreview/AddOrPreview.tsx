import { ChangeEvent } from "react"
import Avatar from "@/Components/Shared/Avatar/Avatar";
import styles from "./addOrPreview.module.css";
import AddImageIcon from "@/Components/Shared/Icons/AddImageIcon/AddImageIcon";
import { useFormContext } from "react-hook-form";
import { ProfileValidation } from "@/utils/Validation/ProfileValidation/ProfileValidation";
import type { ProfileFormFields } from "../../ProfileForm";
import { convertFileToBase64 } from "@/utils/convertFileToBase64";

const profileValidation = new ProfileValidation()

function AddOrPreview() {
  const { setError, setValue, watch, clearErrors } = useFormContext<ProfileFormFields>()
  const avatarSrc = watch("avatarSrc")

  async function handleChange({ target }: ChangeEvent<HTMLInputElement>) {
    const addedFile = (target.files as FileList)[0]
    const avatarValidation = profileValidation.validateAvatar(addedFile)

    if (typeof avatarValidation === "string") {
      setError("avatarSrc", { message: avatarValidation })
    } else {
      const base64Avatar = await convertFileToBase64(addedFile)
      clearErrors("avatarSrc")
      setValue("avatarSrc", base64Avatar)
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
        onChange={handleChange}
      />
    </label>
  );
}

export default AddOrPreview;