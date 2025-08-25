import styles from './vehicleDetails.module.scss'

export default function VehicleDetails({ point }) {
  if (!point) return null;
  const dt = new Date(point.timestamp);
  return (
    <div className={styles.details}>
      <p><strong>Plate:</strong> {point.plate}</p>
      <p><strong>Speed:</strong> {point.speed} km/h</p>
      <p><strong>Fuel:</strong> {point.fuel}%</p>
      <p><strong>Updated:</strong> {dt.toLocaleString()}</p>
    </div>
  );
}
