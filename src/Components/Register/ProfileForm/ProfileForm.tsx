import FormLayout from "@/Components/Shared/FormLayout/FormLayout"
import SelectAvatar from "./SelectAvatar/SelectAvatar"
import Button from "@/Components/Shared/Button/Button"

function ProfileForm() {

  function handleSubmit() {
    // à faire
  }

  return (
    <FormLayout onSubmit={handleSubmit}>
      <SelectAvatar />
      <label htmlFor="username">Pseudo :</label>
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