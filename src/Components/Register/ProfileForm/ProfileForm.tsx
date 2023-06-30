import { FormProvider, useForm } from "react-hook-form"
import { ProfileValidation } from "@/utils/Validation/ProfileValidation/ProfileValidation"
import FormLayout from "@/Components/Shared/FormLayout/FormLayout"
import SelectAvatar from "./SelectAvatar/SelectAvatar"
import Button from "@/Components/Shared/Button/Button"
import { useAppSelector } from "@/redux/hooks"

const profileValidation = new ProfileValidation()

export interface ProfileFormFields {
  username: string
  avatarSrc: string
}

function ProfileForm() {
  const useFormRef = useForm<ProfileFormFields>()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useFormRef

  const hasErrors = Object.keys(errors).length > 0
  const preventFormSubmit = hasErrors

  function onSubmit({ username, avatarSrc }: ProfileFormFields) {
    console.log({ username, avatarSrc })
    // mettre pseudo dans le store
    // changer de modale
  }

  return (
    <FormProvider {...useFormRef} >
      <FormLayout onSubmit={handleSubmit(onSubmit)}>
        <SelectAvatar />
        <label htmlFor="username">Pseudo :</label>
        <input type="text" {...register("username", { validate: profileValidation.validateUsername })} />
        <small>{errors.username?.message}</small>
        <hr />
        <Button
          title="Suivant"
          theme="monochrome"
          disabled={preventFormSubmit}
        />
      </FormLayout>
    </FormProvider>
  )
}

export default ProfileForm