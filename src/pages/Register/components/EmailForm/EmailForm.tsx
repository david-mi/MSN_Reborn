import FormLayout from "../../../../components/FormLayout/FormLayout"
import Button from "../../../../components/Button/Button"
import { useForm } from "react-hook-form"
import { EmailValidation } from "../../../../Services/Validation"

interface EmailFormInput {
  email: string
}

function EmailForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<EmailFormInput>()

  function onSubmit(data: EmailFormInput) {
    console.log(data)
  }

  return (
    <FormLayout onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="email">Adresse de messagerie :</label>
      <input {...register("email", { validate: EmailValidation.validate })} />
      <small>{errors.email?.message}</small>
      <hr />
      <Button
        title="Suivant"
        theme="monochrome"
        disabled={false}
      />
    </FormLayout>
  )
}

export default EmailForm