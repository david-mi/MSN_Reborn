import { Dispatch, SetStateAction } from "react";
import { ModaleLayout } from "@/Components/Shared";
import OptionsForm from "./OptionsForm/OptionsForm";

interface Props {
  setDisplayOptions: Dispatch<SetStateAction<boolean>>
}

function Options({ setDisplayOptions }: Props) {

  function closeOptions() {
    setDisplayOptions(false)
  }

  return (
    <ModaleLayout
      title="Options"
      overlay
      closable
      onCloseButtonClick={closeOptions}
    >
      <OptionsForm closeOptions={closeOptions} />
    </ModaleLayout>
  )
}

export default Options