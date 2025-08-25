import styles from './modal.module.scss';

export default function Modal({ open, onClose, title, children, width = 520 }) {
	if (!open) return null;

	return (
		<div className={styles.modalBackdrop} onClick={onClose}>
			<div
				className={styles.modal}
				style={{ width }}
				onClick={(e) => e.stopPropagation()}
			>
				<div className={styles.modalHeader}>
					<h3>{title}</h3>
					<button
						className={styles.icon}
						onClick={onClose}
						aria-label="Close"
					>
						✕
					</button>
				</div>
				<div>{children}</div>
			</div>
		</div>
	);
}
