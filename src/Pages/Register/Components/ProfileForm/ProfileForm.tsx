import FormLayout from "@/Components/FormLayout/FormLayout"
import SelectAvatar from "./SelectAvatar/SelectAvatar"
import Button from "@/Components/Button/Button"

function ProfileForm() {

  function handleSubmit() {

  }

  return (
    <FormLayout onSubmit={handleSubmit}>
      <SelectAvatar />
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