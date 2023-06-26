import { useContext, useState } from "react"
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
  const [isWaitingSubmit, setIsWaitingSubmit] = useState(false)

  const hasEmailValidationErrors = errors.email !== undefined

  async function onSubmit({ email }: EmailFormInput) {
    setIsWaitingSubmit(true)

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
    finally {
      setIsWaitingSubmit(false)
    }
  }

  return (
    <FormLayout onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="email">Adresse de messagerie :</label>
      <input {...register("email", { validate: emailValidation.validateFromInputAndUnavailableList })} />
      <small>{errors.email?.message}</small>
      <hr />
      <Button
        title="Suivant"
        theme="monochrome"
        wait={isWaitingSubmit}
        disabled={hasEmailValidationErrors || isWaitingSubmit}
      />
    </FormLayout>
  )
}

export default EmailForm