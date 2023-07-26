import Menu from "@/Components/Home/Menu/Menu";
import styles from "./home.module.css"

function Home() {
  return (
    <div className={styles.home} data-testid="home">
      <Menu />
    </div>
  );
}

export default Home;