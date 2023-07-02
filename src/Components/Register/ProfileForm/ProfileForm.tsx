import { FormProvider, useForm } from "react-hook-form"
import { ProfileValidation } from "@/utils/Validation/ProfileValidation/ProfileValidation"
import FormLayout from "@/Components/Shared/FormLayout/FormLayout"
import SelectAvatar from "./SelectAvatar/SelectAvatar"
import Button from "@/Components/Shared/Button/Button"
import { completeProfileStep } from "@/redux/slices/register/register"
import { useAppDispatch } from "@/redux/hooks"
import { ProfileFormFields } from "./types"
import { useEffect } from "react"

const profileValidation = new ProfileValidation()

type Props = React.ComponentProps<"form">

function ProfileForm(props: Props) {
  const useFormRef = useForm<ProfileFormFields>()
  const { register, handleSubmit, formState: { errors } } = useFormRef
  const dispatch = useAppDispatch()

  const hasErrors = Object.keys(errors).length > 0
  const preventFormSubmit = hasErrors

  function onSubmit(formEntries: ProfileFormFields) {
    dispatch(completeProfileStep(formEntries))
  }

  useEffect(() => {
    register("avatarSrc", { required: profileValidation.errorsMessages.avatar.REQUIRED })
  }, [register])

  return (
    <FormProvider {...useFormRef} >
      <FormLayout onSubmit={handleSubmit(onSubmit)} {...props}>
        <SelectAvatar />
        <label htmlFor="username">Pseudo :</label>
        <input
          id="username"
          type="text"
          data-testid="register-profile-username-input"
          {...register("username", { validate: profileValidation.validateUsername })}
        />
        <small data-testid="register-profile-username-error">{errors.username?.message}</small>
        <hr />
        <Button
          title="Suivant"
          theme="monochrome"
          data-testid="register-profile-submit-button"
          disabled={preventFormSubmit}
        />
      </FormLayout>
    </FormProvider>
  )
}

export default ProfileForm