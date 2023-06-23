import type { RegistrationStep, RegistrationData } from "./types"
import { createContext } from "react"

interface RegisterContextType {
  setRegistrationStep: React.Dispatch<React.SetStateAction<RegistrationStep>>
  registrationData: RegistrationData
  setRegistrationData: React.Dispatch<React.SetStateAction<RegistrationData>>
}

export const RegisterContext = createContext<RegisterContextType>({} as RegisterContextType)