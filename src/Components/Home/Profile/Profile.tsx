import { useState } from "react";
import EditProfileForm from "./EditProfileForm/EditProfileForm"
import DisplayProfile from "./DisplayProfile/DisplayProfile";

function Profile() {
  const [isEditingProfile, setIsEditingProfile] = useState(false)

  function toggleProfileState() {
    setIsEditingProfile((state) => !state)
  }

  return (
    <>
      {isEditingProfile
        ? <EditProfileForm toggleProfileState={toggleProfileState} />
        : <DisplayProfile toggleProfileState={toggleProfileState} />
      }
    </>
  );
}

export default Profile;