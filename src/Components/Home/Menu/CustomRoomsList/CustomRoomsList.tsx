import { useState } from "react";
import DisplayedCustomRoom from "./DisplayedCustomRoom/DisplayedCustomRoom";
import useRoom from "@/hooks/useRoom";
import { ArrowIconLarge } from "@/Components/Shared";
import styles from "./customRoomsList.module.css"

function CustomRoomsList() {
  const { customRoomsList, customRoomsListCount } = useRoom()
  const [displayCustomRoomsList, setDisplayCustomRoomsList] = useState(true)

  function toggleDisplayCustomRoomsList() {
    setDisplayCustomRoomsList((state) => !state)
  }

  return (
    <div className={styles.container}>
      {customRoomsListCount > 0 && (
        <>
          <button className={styles.title} onClick={toggleDisplayCustomRoomsList}>
            <ArrowIconLarge className={displayCustomRoomsList ? styles.display : ""} />
            <span>Salons Personnalisés</span>
          </button>
          {displayCustomRoomsList && customRoomsList.map((room) => <DisplayedCustomRoom key={room.id} room={room} />)}
        </>
      )}
    </div>
  );
}

export default CustomRoomsList;