import styles from './vehicleList.module.scss'

export default function VehicleList({ vehicles, selected, onSelect, filter }) {
	const list = vehicles
		.filter(
			(v) =>
				!filter || v.plate.toUpperCase().includes(filter.toUpperCase())
		)
		.sort((a, b) => a.plate.localeCompare(b.plate));

	return (
		<div className={styles.vehicleList}>
			<h3>Vehicles</h3>
			<ul className={styles.list}>
				{list.map((v) => (
					<li
						key={v.plate}
						className={selected === v.plate ? styles.active : ''}
						onClick={() => onSelect(v.plate)}
					>
						{v.plate} — {v.model} / {v.manufacturer} / {v.year}
					</li>
				))}
			</ul>
		</div>
	);
}
