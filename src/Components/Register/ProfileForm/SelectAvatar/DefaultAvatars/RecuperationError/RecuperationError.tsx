import styles from "./recuperationError.module.css";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { getDefaultAvatars } from "@/redux/slices/register/register";
import Button from "@/Components/Shared/Button/Button";

function RecuperationError() {
  const getDefaultAvatarsRequestError = useAppSelector(({ register }) => register.getDefaultAvatarsRequest.error)
  const dispatch = useAppDispatch()

  function handleClick() {
    dispatch(getDefaultAvatars())
  }

  return (
    <div className={styles.recuperationError}>
      <small>{getDefaultAvatarsRequestError}</small>
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