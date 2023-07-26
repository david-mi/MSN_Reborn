import { useState } from "react";
import EditProfileForm from "./EditProfileForm/EditProfileForm"
import DisplayProfile from "./DisplayProfile/DisplayProfile";
import type { EditProfileFormFields } from "./EditProfileForm/types";

function Profile() {
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [elementToTargetInForm, setElementToTargetInForm] = useState<keyof Omit<EditProfileFormFields, "avatarSrc">>("username")

  function openEditProfileForm(buttonTarget: keyof Omit<EditProfileFormFields, "avatarSrc">) {
    setIsEditingProfile((state) => !state)
    setElementToTargetInForm(buttonTarget)
  }

  function closeEditProfileForm() {
    setIsEditingProfile(false)
  }

  return (
    <>
      {isEditingProfile
        ? <EditProfileForm elementToTargetInForm={elementToTargetInForm} closeEditProfileForm={closeEditProfileForm} />
        : <DisplayProfile openEditProfileForm={openEditProfileForm} />
      }
    </>
  );
}

export default Profile;