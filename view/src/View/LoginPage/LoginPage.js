import LoginForm from "../../Components/LoginForm/LoginForm";
import styles from "./loginPage.module.scss"
export default function LoginPage({ onSwitchToSignup }) {
  return (
    <div className={styles.login}>
      <LoginForm />
      <button
        onClick={onSwitchToSignup}
        className={styles.switchBt}
      >
        Create a new account
      </button>
    </div>
  );
}
