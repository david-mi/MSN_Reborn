import type { RegistrationStep, RegistrationData } from "./types"
import { createContext, useState } from "react"
import Register from "./Register"

interface RegisterContextType {
  registrationstep: RegistrationStep
  setRegistrationStep: React.Dispatch<React.SetStateAction<RegistrationStep>>
  registrationData: RegistrationData
  setRegistrationData: React.Dispatch<React.SetStateAction<RegistrationData>>
}

export const RegisterContext = createContext<RegisterContextType>({} as RegisterContextType)

export function RegisterProvider() {
  const [registrationstep, setRegistrationStep] = useState<RegistrationStep>("EMAIL")
  const [registrationData, setRegistrationData] = useState<RegistrationData>({
    email: "",
    password: "",
    nickname: "",
    avatar: ""
  })

  return (
    <RegisterContext.Provider
      value={{
        registrationstep,
        setRegistrationStep,
        registrationData,
        setRegistrationData
      }}
    >
      <Register />
    </RegisterContext.Provider>
  )
}

export default RegisterProvider
