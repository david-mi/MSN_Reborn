import { Avatar, ModaleLayout, Button, FormLayout } from "@/Components/Shared";
import { Dispatch, SetStateAction, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import styles from "./leaveRoomAlert.module.css";
import { leaveRoom } from "@/redux/slices/room/room";
import { SubscribedUser } from "@/redux/slices/room/types";
import { UserProfile } from "@/redux/slices/user/types";
import { useForm } from "react-hook-form";

interface Props {
  roomName: string,
  roomAvatarSrc?: string
  setDisplayLeaveRoomAlert: Dispatch<SetStateAction<boolean>>
  subscribedRoomUsers: { [userId: string]: SubscribedUser }
  currentRoomUsersProfile: Map<string, UserProfile>
}

function LeaveRoomAlert({ roomName, roomAvatarSrc, setDisplayLeaveRoomAlert, subscribedRoomUsers, currentRoomUsersProfile }: Props) {
  const dispatch = useAppDispatch()
  const { register, handleSubmit, formState: { errors }, watch } = useForm<{ email: string }>()
  const request = useAppSelector(({ room }) => room.leaveRoomRequest)
  const currentUserName = useAppSelector(({ user }) => user.username)
  const currentRoomId = useAppSelector(({ room }) => room.currentRoomId)
  const currentUserId = useAppSelector(({ user }) => user.id)
  const subscribedRoomUsersList = useMemo(() => {
    return Array
      .from(currentRoomUsersProfile.values())
      .filter((userProfile) => subscribedRoomUsers[userProfile.id] && userProfile.id !== currentUserId, [])
  }, [subscribedRoomUsers])
  const canDelegateAdminRole = (
    subscribedRoomUsersList.length > 0 &&
    subscribedRoomUsers[currentUserId].role === "admin"
  )
  const hasErrors = Object.keys(errors).length > 0
  const selectedEmail = watch("email")
  const preventFormSubmit = hasErrors || (canDelegateAdminRole && !selectedEmail) || request.status === "PENDING"

  function closeLeaveRoomAlert() {
    setDisplayLeaveRoomAlert(false)
  }

  async function onSubmit({ email }: { email: string }) {
    try {
      if (canDelegateAdminRole) {
        const userToPromote = subscribedRoomUsersList.find((subscribedRoomUser) => subscribedRoomUser.email === email)!
        await dispatch(leaveRoom({ roomId: currentRoomId!, username: currentUserName, roomName, userToPromote })).unwrap()
      } else {
        await dispatch(leaveRoom({ roomId: currentRoomId!, username: currentUserName, roomName })).unwrap()
      }
      closeLeaveRoomAlert()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <ModaleLayout
      title={"Quitter un salon"}
      closable
      onCloseButtonClick={closeLeaveRoomAlert}
      overlay
    >
      <FormLayout onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.infos}>
          <p className={styles.title}>Quitter le salon</p>
          <p className={styles.roomName}>{roomName} ?</p>
          <Avatar size="medium" src={roomAvatarSrc} />
          <small className={styles.description}>Le salon ne figurera plus dans votre liste</small>
        </div>
        {canDelegateAdminRole && (
          <select
            defaultValue="choose"
            id="email"
            {...register("email", {
              validate: (selectedEmail: string) => {
                return (
                  subscribedRoomUsersList.findIndex((user) => user.email === selectedEmail) !== -1 || "pas bon"
                )
              }
            })}
          >
            <option value="choose" disabled>Nommer un admin</option>
            {subscribedRoomUsersList.map(({ email, username, id }) => {
              return <option key={id} value={email}>{username} : ({email})</option>
            })}
          </select>
        )}
        <div className={styles.submitButtonContainer}>
          <Button
            theme="gradient"
            title="Accepter"
            wait={request.status === "PENDING"}
            disabled={preventFormSubmit}
          />
          <small>{request.error}</small>
        </div>
      </FormLayout>
    </ModaleLayout>
  );
}

export default LeaveRoomAlert;