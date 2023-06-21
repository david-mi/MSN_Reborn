import FormLayout from "../../../../components/FormLayout/FormLayout"
import Button from "../../../../components/Button/Button"

function EmailForm() {
  function handleSumbit(event: React.FormEvent) {
    event.preventDefault()
    console.log(event)
  }

  return (
    <FormLayout onSubmit={handleSumbit}>
      <label htmlFor="email">Adresse de messagerie :</label>
      <input type="email" name="email" id="email" />
      <small>Une erreur est survenue</small>
      <hr />
      <Button
        title="Suivant"
        style="monochrome"
        disabled={false}
        onClick={() => console.log("button click")}
      />
    </FormLayout>
  )
}

export default EmailForm