import FormLayout from "@/Components/FormLayout/FormLayout"
import Avatar from "@/Components/Avatar/Avatar"
import AddAvatar from "./AddAvatar/AddAvatar"
import Button from "@/Components/Button/Button"

function ProfileForm() {

  function handleSubmit() {

  }

  return (
    <FormLayout onSubmit={handleSubmit}>
      <Avatar size="medium" />
      <AddAvatar />
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