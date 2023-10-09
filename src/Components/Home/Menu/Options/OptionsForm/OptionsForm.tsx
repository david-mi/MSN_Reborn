import { useForm } from "react-hook-form"
import { ChangeEvent, useMemo } from "react"
import { Button, FormLayout } from "@/Components/Shared"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import type { Options } from "@/redux/slices/options/types"
import { updateOptions } from "@/redux/slices/options/options"
import wizzSoundSrc from "/sounds/wizz.mp3"
import messageNotificationSoundSrc from "/sounds/message_notification.mp3"
import styles from "./optionsForm.module.css"
import { Checkbox } from "@/Components/Shared"

interface Props {
  closeOptions: () => void
}

function OptionsForm({ closeOptions }: Props) {
  const optionsRequest = useAppSelector(({ options }) => options.request)
  const currentUserOptions = useAppSelector(({ options }) => options.user)
  const { wizzShake, wizzVolume, messageNotificationVolume } = currentUserOptions
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<Options>({ defaultValues: currentUserOptions })
  const dispatch = useAppDispatch()
  const wizzSound = useMemo(() => {
    const wizzSound = new Audio(wizzSoundSrc)
    wizzSound.volume = wizzVolume
    return wizzSound
  }, [])
  const messageNotificationSound = useMemo(() => {
    const messageNotificationSound = new Audio(messageNotificationSoundSrc)
    messageNotificationSound.volume = messageNotificationVolume
    return messageNotificationSound
  }, [])
  const hasErrors = Object.keys(errors).length > 0

  async function onSubmit(options: Options) {
    try {
      await dispatch(updateOptions({ ...options, })).unwrap()
      closeOptions()
    } catch (error) { }
  }

  function playWizzSound(event: ChangeEvent<HTMLInputElement>) {
    const volume = event.target.valueAsNumber

    wizzSound.volume = volume
    wizzSound.currentTime = 0
    wizzSound.play()
  }

  function playMessageNotificationSound(event: ChangeEvent<HTMLInputElement>) {
    const volume = event.target.valueAsNumber

    messageNotificationSound.volume = volume
    messageNotificationSound.currentTime = 0
    messageNotificationSound.play()
  }

  return (
    <FormLayout onSubmit={handleSubmit(onSubmit)} className={styles.optionsForm}>
      <div className={styles.wizzShakeContainer}>
        <label htmlFor="wizzShake">Tremblement des wizz :</label>
        <Checkbox
          autoFocus
          id="wizzShake"
          defaultChecked={wizzShake}
          {...register("wizzShake")}
        />
      </div>
      <div>
        <label htmlFor="wizzVolume">Volume des wizz</label>
        <input
          autoFocus
          id="wizzVolume"
          type="range"
          min={0}
          max={1}
          step={0.1}
          defaultValue={wizzVolume}
          {...register("wizzVolume", { onChange: playWizzSound, valueAsNumber: true })}
        />
      </div>
      <div>
        <label htmlFor="messageNotificationVolume">Volume des notifications de message</label>
        <input
          id="messageNotificationVolume"
          type="range"
          min={0}
          max={1}
          step={0.1}
          defaultValue={messageNotificationVolume}
          {...register("messageNotificationVolume", { onChange: playMessageNotificationSound, valueAsNumber: true })}
        />
      </div>
      <div>
        <Button
          title="Sauvegarder"
          theme="monochrome"
          wait={optionsRequest.status === "PENDING"}
          disabled={hasErrors}
        />
        <small>{optionsRequest.error}</small>
      </div>
    </FormLayout>
  )
}

export default OptionsForm