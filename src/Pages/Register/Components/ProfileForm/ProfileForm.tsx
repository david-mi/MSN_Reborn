import { ChangeEvent } from "react"
import FormLayout from "@/Components/FormLayout/FormLayout"
import SelectAvatar from "./SelectAvatar/SelectAvatar"
import Button from "@/Components/Button/Button"
import styles from "./profileForm.module.css"

function ProfileForm() {

  function handleSubmit() {

  }

  function handleAddFile({ target }: ChangeEvent<HTMLInputElement>) {
    const selectedFile = (target.files as FileList)[0]
    console.log(selectedFile)
  }

  return (
    <FormLayout onSubmit={handleSubmit}>
      <SelectAvatar>
        <label htmlFor="avatar-add" className={styles.addFile}>+</label>
        <input type="file" id="avatar-add" onChange={handleAddFile} />
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