import { ChangeEvent } from "react"
import Avatar from "@/Components/Shared/Avatar/Avatar";
import styles from "./addOrPreview.module.css";
import AddImageIcon from "@/Components/Shared/Icons/AddImageIcon/AddImageIcon";

interface Props {
  handleAddFile: (event: ChangeEvent<HTMLInputElement>) => void
}

function AddOrPreview({ handleAddFile }: Props) {
  return (
    <label htmlFor="avatar-add" className={styles.previewLabel}>
      <Avatar size="medium" className={styles.avatar} />
      <AddImageIcon />
      <input
        type="file"
        className={styles.addFileInput}
        id="avatar-add"
        onChange={handleAddFile}
      />
    </label>
  );
}

export default AddOrPreview;