import styles from "./instructions.module.css";

function Instructions() {
  return (
    <div className={styles.instructions}>
      <div>
        <h2>Un email de vérification vous a été envoyé</h2>
        <small>pensez à vérifier vos spams</small>
      </div>
      <hr />
      <div>
        <h2>Email non reçu ?</h2>
        <p>Cliquez sur le bouton ci-dessous pour le renvoyer</p>
      </div>
    </div>
  );
}

export default Instructions;