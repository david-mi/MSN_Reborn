import { Button } from "@/Components/Shared";
import styles from "./chatform.module.css";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { sendMessage } from "@/redux/slices/room/room";
import { useForm } from "react-hook-form";
import { ChatFormFields } from "./type";
import { MessageValidation } from "@/utils/Validation";

interface Props {
  roomId: string
}

function ChatForm({ roomId }: Props) {
  const dispatch = useAppDispatch()
  const { register, handleSubmit, formState: { errors }, setError } = useForm<ChatFormFields>()
  const sendMessageRequest = useAppSelector(({ room }) => room.sendMessageRequest)
  const hasErrors = Object.keys(errors).length > 0
  const preventFormSubmit = hasErrors || sendMessageRequest.status === "PENDING"

  async function onSubmit({ content }: ChatFormFields) {
    try {
      await dispatch(sendMessage({ roomId, content })).unwrap()
    } catch (error) {
      setError("content", { message: error as string })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.chatForm}>
      <textarea {...register("content", { validate: MessageValidation.validateFromInput })}></textarea>
      <Button
        className={styles.submitButton}
        theme="gradient"
        title="Envoyer"
        wait={sendMessageRequest.status === "PENDING"}
        disabled={preventFormSubmit}
      />
      <small>{errors.content?.message}</small>
    </form>
  );
}

export default ChatForm;