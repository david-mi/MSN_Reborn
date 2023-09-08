import { KeyboardEvent, MutableRefObject, useEffect } from "react"
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { sendMessage } from "@/redux/slices/room/room";
import { ChatFormFields } from "./type";
import { MessageValidation } from "@/utils/Validation";
import styles from "./chatForm.module.css";

interface Props {
  roomId: string
  usersId: string[]
  shouldScrollToBottomRef: MutableRefObject<boolean>
}

function ChatForm({ roomId, usersId, shouldScrollToBottomRef }: Props) {
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
      await dispatch(sendMessage({ roomId, usersId, content })).unwrap()
      setFocus("content")
      reset()
    } catch (error) {
      setError("content", { message: error as string })
    }
  }

  function handleKeyDown(event: KeyboardEvent) {
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
      <textarea
        {...register("content", { validate: MessageValidation.validateFromInput, onChange: () => clearErrors() })}
        onKeyDown={handleKeyDown}
        disabled={sendMessageRequest.status === "PENDING"}
      />
      <small>{errors.content?.message}</small>
    </form >
  );
}

export default ChatForm;