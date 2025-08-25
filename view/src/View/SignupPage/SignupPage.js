import SignupForm from "../../Components/SignupForm/SignupForm"
import styles from "./signup.module.scss"

export default function SignupPage({ onSwitchToLogin }) {
  return (
    <div className={styles.signup}>
      <SignupForm onSwitchToLogin={onSwitchToLogin} />
    </div>
  );
}
