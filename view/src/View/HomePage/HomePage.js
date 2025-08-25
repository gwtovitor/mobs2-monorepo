/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../Context/AuthContext';
import { listVehicles } from '../../Services/vehicles';
import { useTelemetry } from '../../Hooks/useTelemetry';
import TopBar from '../../Components/TopBar/TopBar';
import Controls from '../../Components/Controls/Controls';
import VehicleList from '../../Components/VehicleList/VeihcleList';
import VehicleDetails from '../../Components/VehicleDetails/VeihcleDetails';
import MapView from '../../Components/MapView/MapView';
import GoogleMapsProvider from '../../Context/GoogleMapsProvider';
import Modal from '../../Components/Modal/Modal';
import VehicleModal from '../../Components/VehicleModal/VehicleModal';
import styles from "./homePage.module.scss"

export default function HomePage() {
	const { token } = useAuth();
	const [vehicles, setVehicles] = useState([]);
	const [filter, setFilter] = useState('');
	const [showHistory, setShowHistory] = useState(true);
	const [selected, setSelected] = useState(null);
	const [crudOpen, setCrudOpen] = useState(false);

	const {
		connected,
		lastByPlate,
		historyByPlate,
		subscribePlate,
		requestHistory,
	} = useTelemetry(token);

	async function reload() {
		const list = await listVehicles(token);
		setVehicles(list);
	}
	useEffect(() => {
		reload().catch(console.error);
	}, [token]);

	useEffect(() => {
		async function run() {
			const list = await listVehicles(token);
			setVehicles(list);
			if (!selected && list.length > 0) setSelected(list[0].plate);
		}
		run().catch(console.error);
	}, [token]);

	useEffect(() => {
		if (selected && connected) {
			subscribePlate(selected);
			requestHistory(selected, 100);
		}
	}, [selected, connected, subscribePlate, requestHistory]);

	const selectedPoint = useMemo(() => {
		if (!selected) return null;
		return lastByPlate[selected] || null;
	}, [selected, lastByPlate]);

	return (
		<div className={styles.homePage}>
			<TopBar />
			<div className={styles.content}>
				<aside className={styles.sideBar}>
					<Controls
						filter={filter}
						setFilter={setFilter}
						showHistory={showHistory}
						setShowHistory={setShowHistory}
					/>
					<button
						className={styles.primary}
						onClick={() => setCrudOpen(true)}
						style={{ width: '100%', marginBottom: 10 }}
					>
						Manage vehicles
					</button>
					<VehicleList
						vehicles={vehicles}
						selected={selected}
						onSelect={setSelected}
						filter={filter}
					/>
					<VehicleDetails point={selectedPoint} />
					<div className="meta">
						WS: {connected ? 'connected' : 'disconnected'}
					</div>
				</aside>
				<Modal
					open={crudOpen}
					onClose={() => setCrudOpen(false)}
					title="Vehicle management"
				>
					<VehicleModal
						initialPlate={selected}
						onDone={async () => {
							await reload();
							setCrudOpen(false);
						}}
					/>
				</Modal>
				<main className="map">
					<GoogleMapsProvider>
						<MapView
							lastByPlate={lastByPlate}
							historyByPlate={historyByPlate}
							selectedPlate={selected}
							showHistory={showHistory}
						/>
					</GoogleMapsProvider>
				</main>
			</div>
		</div>
	);
}
