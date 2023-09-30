import { KeyboardEvent, MutableRefObject, useEffect } from "react"
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { sendMessage } from "@/redux/slices/room/room";
import { ChatFormFields } from "./type";
import { MessageValidation } from "@/utils/Validation";
import styles from "./chatForm.module.css";
import { RoomUsers } from "@/redux/slices/room/types";
import ChatFormOptions from "./ChatFormOptions/ChatFormOptions";
import { ButtonWithSvg } from "@/Components/Shared";

interface Props {
  roomId: string
  users: RoomUsers
  shouldScrollToBottomRef: MutableRefObject<boolean>
}

function ChatForm({ roomId, users, shouldScrollToBottomRef }: Props) {
  const dispatch = useAppDispatch()
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
    setFocus,
    clearErrors
  } = useForm<ChatFormFields>({ reValidateMode: "onSubmit" })
  const sendMessageRequest = useAppSelector(({ room }) => room.sendMessageRequest)

  async function onSubmit({ content }: ChatFormFields) {
    try {
      await dispatch(sendMessage({ roomId, users, content })).unwrap()
      setFocus("content")
      reset()
    } catch (error) {
      setError("content", { message: error as string })
    }
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (matchMedia("(max-width: 750px)").matches) return

    if (event.key === "Enter" && event.shiftKey === false) {
      handleSubmit(onSubmit)()
      shouldScrollToBottomRef.current = true
      event.preventDefault()
    }
  }

  useEffect(() => {
    setFocus("content")
  }, [roomId])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.chatForm}>
      <ChatFormOptions roomId={roomId} />
      <textarea
        {...register("content", { validate: MessageValidation.validateFromInput, onChange: () => clearErrors() })}
        onKeyDown={handleKeyDown}
        disabled={sendMessageRequest.status === "PENDING"}
      />
      <ButtonWithSvg className={styles.submitButton}>
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
          <path fill="currentColor" d="m3.4 20.4l17.45-7.48a1 1 0 0 0 0-1.84L3.4 3.6a.993.993 0 0 0-1.39.91L2 9.12c0 .5.37.93.87.99L17 12L2.87 13.88c-.5.07-.87.5-.87 1l.01 4.61c0 .71.73 1.2 1.39.91z"></path>
        </svg>
      </ButtonWithSvg>
      <small>{errors.content?.message}</small>
    </form >
  );
}

export default ChatForm;