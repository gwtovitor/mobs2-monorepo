import styles from "./controls.module.scss"

export default function Controls({ filter, setFilter, showHistory, setShowHistory }) {
  return (
    <div className={styles.controls}>
      <input
        placeholder="Search by plate..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <label className={styles.toggle}>
        <input
          type="checkbox"
          checked={showHistory}
          onChange={(e) => setShowHistory(e.target.checked)}
        />
        Show history
      </label>
    </div>
  );
}
