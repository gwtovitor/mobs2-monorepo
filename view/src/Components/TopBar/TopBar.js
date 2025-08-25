import { useAuth } from "../../Context/AuthContext";
import styles from "./topBar.module.scss"

export default function TopBar() {
  const { logout } = useAuth();
  return (
    <header className={styles.topBar}>
      <h1>MOBS2 – Fleet Panel</h1>
      <button onClick={logout}>Logout</button>
    </header>
  );
}
