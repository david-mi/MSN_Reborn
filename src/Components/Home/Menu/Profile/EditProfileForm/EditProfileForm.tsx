import { useEffect, useRef } from "react";
import SelectAvatar from "@/Components/Register/ProfileForm/SelectAvatar/SelectAvatar";
import { FormLayout, Button, ModaleLayout } from "@/Components/Shared";
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { FormProvider, useForm } from "react-hook-form"
import { ProfileValidation } from "@/utils/Validation";
import { EditProfileFormFields } from "./types";
import { SelectDisplayedStatus } from "@/Components/Shared";
import { editProfile } from "@/redux/slices/user/user";
import styles from "./editProfileForm.module.css";
import { statusesObject } from "@/Components/Shared/SelectDisplayedStatus/statusesData";

interface Props {
  closeEditProfileForm: () => void
  elementToTargetInForm: keyof Omit<EditProfileFormFields, "avatarSrc">
}

function EditProfileForm({ closeEditProfileForm, elementToTargetInForm }: Props) {
  const avatarSrc = useAppSelector(({ user }) => user.avatarSrc)
  const username = useAppSelector(({ user }) => user.username)
  const displayedStatus = useAppSelector(({ user }) => user.displayedStatus)
  const personalMessage = useAppSelector(({ user }) => user.personalMessage)
  const editProfileRequest = useAppSelector(({ user }) => user.editProfileRequest)
  const useFormRef = useForm<EditProfileFormFields>({
    defaultValues: {
      avatarSrc,
      username,
      displayedStatus,
      personalMessage
    }
  })
  const { register, handleSubmit, formState: { errors } } = useFormRef
  const dispatch = useAppDispatch()
  const formRef = useRef<HTMLFormElement>(null!)

  const hasErrors = Object.keys(errors).length > 0
  const preventFormSubmit = hasErrors

  async function onSubmit(formEntries: EditProfileFormFields) {
    try {
      await dispatch(editProfile(formEntries)).unwrap()
      closeEditProfileForm()
    } catch (error) { }
  }

  useEffect(() => {
    if (elementToTargetInForm === "personalMessage" || elementToTargetInForm === "username") {
      formRef.current[elementToTargetInForm].select()
    }
  }, [])

  return (
    <ModaleLayout
      title="Editer votre profil"
      closable
      onCloseButtonClick={closeEditProfileForm}
      overlay
    >
      <FormProvider {...useFormRef} >
        <FormLayout
          onSubmit={handleSubmit(onSubmit)}
          ref={formRef}
          className={styles.form}
        >
          <SelectAvatar />
          <SelectDisplayedStatus
            defaultStatus={statusesObject[displayedStatus].sentence}
            defaultListOpen={elementToTargetInForm === "displayedStatus"}
          />
          <div>
            <label htmlFor="username">Pseudo :</label>
            <input
              id="username"
              defaultValue={username}
              type="text"
              data-testid="home-profile-username-input"
              {...register("username", { validate: ProfileValidation.validateUsername })}
            />
            <small data-testid="home-profile-username-error">{errors.username?.message}</small>
          </div>
          <div>
            <label htmlFor="personalMessage">Message perso :</label>
            <input
              id="personalMessage"
              defaultValue={personalMessage}
              type="text"
              data-testid="home-profile-personalMessage-input"
              {...register("personalMessage", { validate: ProfileValidation.validatePersonalMessage })}
            />
            <small data-testid="home-profile-personalMessage-error">{errors.personalMessage?.message}</small>
          </div>
          <div>
            <Button
              title="Confirmer"
              theme="monochrome"
              data-testid="home-profile-submit-button"
              wait={editProfileRequest.status === "PENDING"}
              disabled={preventFormSubmit}
            />
            <small data-testid="home-profile-submit-error">{editProfileRequest.error}</small>
          </div>
        </FormLayout>
      </FormProvider>
    </ModaleLayout>
  );
}

export default EditProfileForm;