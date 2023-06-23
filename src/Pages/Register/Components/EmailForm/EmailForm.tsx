import { useContext } from "react"
import FormLayout from "@/Components/FormLayout/FormLayout"
import Button from "@/Components/Button/Button"
import { useForm } from "react-hook-form"
import { EmailValidation } from "@/Services/Validation"
import { RegisterContext } from "../../Context"

const emailValidation = new EmailValidation()

interface EmailFormInput {
  email: string
}

function EmailForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm<EmailFormInput>()
  const { setRegistrationStep, setRegistrationData } = useContext(RegisterContext)

  const hasEmailValidationErrors = errors.email !== undefined

  async function onSubmit({ email }: EmailFormInput) {
    try {
      await emailValidation.checkAvailabilityFromDatabase(email)
      setRegistrationData((registrationData) => {
        return {
          ...registrationData,
          email
        }
      })
      setRegistrationStep("PROFILE")
    }
    catch (error) {
      setError("email", {
        message: (error as Error)?.message ?? "Une erreur est survenue"
      })
    }
  }

  function handleEmailValidation(email: string) {
    return (
      emailValidation.validateFromInput(email) ||
      emailValidation.validateFromUnavailableList(email)
    )
  }

  return (
    <FormLayout onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="email">Adresse de messagerie :</label>
      <input {...register("email", { validate: handleEmailValidation })} />
      <small>{errors.email?.message}</small>
      <hr />
      <Button
        title="Suivant"
        theme="monochrome"
        disabled={hasEmailValidationErrors}
      />
    </FormLayout>
  )
}

export default EmailForm