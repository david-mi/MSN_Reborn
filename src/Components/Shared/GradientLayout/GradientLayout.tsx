import styles from "./gradientLayout.module.css";

interface Props {
  children: JSX.Element[] | JSX.Element
}

function GradientLayout({ children }: Props) {
  return (
    <div className={styles.gradientLayout}>
      {children}
    </div>
  );
}

export default GradientLayout;