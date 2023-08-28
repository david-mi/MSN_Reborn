import { useAppSelector } from "@/redux/hooks";
import DisplayedCustomRoom from "./DisplayedCustomRoom/DisplayedCustomRoom";
import styles from "./customRoomsList.module.css"

function CustomRoomsList() {
  const roomsList = useAppSelector(({ room }) => room.roomsList)

  return (
    <ul className={styles.container}>
      <h2 className={styles.title}>Salons Personnalisés</h2>
      {Object
        .values(roomsList)
        .filter((room) => room.type === "manyToMany")
        .map((room) => <DisplayedCustomRoom key={room.id} room={room} />)
      }
    </ul>
  );
}

export default CustomRoomsList;