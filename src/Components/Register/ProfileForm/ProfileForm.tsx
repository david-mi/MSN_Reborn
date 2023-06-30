import { FormProvider, useForm } from "react-hook-form"
import { ProfileValidation } from "@/utils/Validation/ProfileValidation/ProfileValidation"
import FormLayout from "@/Components/Shared/FormLayout/FormLayout"
import SelectAvatar from "./SelectAvatar/SelectAvatar"
import Button from "@/Components/Shared/Button/Button"

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
    formState: { errors },
  } = useFormRef


  const shouldPreventSumbit = false

  function onSubmit({ username, avatarSrc }: ProfileFormFields) {
    console.log({ username, avatarSrc })
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
          disabled={false}
        />
      </FormLayout>
    </FormProvider>
  )
}

export default ProfileForm