import { useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { ProfileValidation } from "@/utils/Validation/"
import { FormLayout, Button } from "@/Components/Shared"
import SelectAvatar from "./SelectAvatar/SelectAvatar"
import { useAppDispatch } from "@/redux/hooks"
import { completeProfileStep } from "@/redux/slices/register/register"
import { ProfileFormFields } from "./types"

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
    register("avatarSrc", { required: ProfileValidation.errorsMessages.avatar.REQUIRED })
  }, [register])

  return (
    <FormProvider {...useFormRef} >
      <FormLayout onSubmit={handleSubmit(onSubmit)} {...props}>
        <SelectAvatar />
        <div>
          <label htmlFor="username">Pseudo :</label>
          <input
            id="username"
            type="text"
            data-testid="register-profile-username-input"
            {...register("username", { validate: ProfileValidation.validateUsername })}
          />
          <small data-testid="register-profile-username-error">{errors.username?.message}</small>
        </div>
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