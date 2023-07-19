import styles from "./footerLinks.module.css";

interface Props {
  children: JSX.Element | JSX.Element[]
}

function FooterLinks({ children }: Props) {
  return (
    <div className={styles.footerLinks}>
      {children}
    </div>
  );
}

export default FooterLinks;