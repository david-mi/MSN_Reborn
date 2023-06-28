import { useState, ChangeEvent } from "react"
import FormLayout from "@/Components/Shared/FormLayout/FormLayout"
import SelectAvatar from "./SelectAvatar/SelectAvatar"
import Button from "@/Components/Shared/Button/Button"
import styles from "./profileForm.module.css"
import AddImageIcon from "@/Components/Shared/Icons/AddImageIcon/AddImageIcon"

function ProfileForm() {
  const [selectedAvatar, setSelectedAvatar] = useState<File | Blob | null>(null)

  function handleSubmit() {

  }

  function handleAddFile({ target }: ChangeEvent<HTMLInputElement>) {
    const selectedFile = (target.files as FileList)[0]
    setSelectedAvatar(selectedFile)
    console.log(selectedFile, selectedAvatar)
  }

  return (
    <FormLayout onSubmit={handleSubmit}>
      <SelectAvatar setSelectedAvatar={setSelectedAvatar}>
        <label htmlFor="avatar-add" className={styles.addFileLabel}>
          <AddImageIcon />
        </label>
        <input
          type="file"
          className={styles.addFileInput}
          id="avatar-add"
          onChange={handleAddFile}
        />
      </SelectAvatar>
      <label htmlFor="email">Pseudo :</label>
      <input type="text" />
      <small></small>
      <hr />
      <Button
        title="Suivant"
        theme="monochrome"
        disabled={false}
      />
    </FormLayout>
  )
}

export default ProfileForm