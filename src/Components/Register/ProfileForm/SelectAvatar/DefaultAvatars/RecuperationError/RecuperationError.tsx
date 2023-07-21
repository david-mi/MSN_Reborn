import styles from "./recuperationError.module.css";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { getDefaultAvatars } from "@/redux/slices/register/register";
import Button from "@/Components/Shared/Button/Button";

function RecuperationError() {
  const { getDefaultAvatarsError } = useAppSelector(({ register }) => register.profile)
  const dispatch = useAppDispatch()

  function handleClick() {
    dispatch(getDefaultAvatars())
  }

  return (
    <div className={styles.recuperationError}>
      <small>{getDefaultAvatarsError}</small>
      <Button
        title="Réessayer"
        theme="gradient"
        type="button"
        onClick={handleClick}
      />
    </div>
  );
}

export default RecuperationError;