import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../Context/AuthContext';
import {
	createVehicle,
	deleteVehicle,
	updateVehicle,
	getVehicleByPlate,
} from '../../Services/vehicles';
import styles from './vehicleModal.module.scss';

const ACTIONS = [
	{ key: 'create', label: 'Create' },
	{ key: 'update', label: 'Update' },
	{ key: 'delete', label: 'Delete' },
];

function toUpperTrim(value) {
	return (value || '').trim().toUpperCase();
}

function parseYearSafe(text) {
	const n = Number(text);
	return Number.isFinite(n) ? n : undefined;
}

function useVehiclePrefill({
	enabled,
	plate,
	token,
	setModelName,
	setMake,
	setYearText,
	setError,
}) {
	useEffect(() => {
		let cancelled = false;

		async function load() {
			if (!enabled || !plate) return;
			try {
				const v = await getVehicleByPlate(token, plate);
				if (!cancelled) {
					setModelName(v.model || '');
					setMake(v.manufacturer || '');
					setYearText(String(v.year || ''));
				}
			} catch (e) {
				if (!cancelled) setError(e.message);
			}
		}
		load();
		return () => {
			cancelled = true;
		};
	}, [enabled, plate, token, setModelName, setMake, setYearText, setError]);
}

function ActionTabs({ action, setAction }) {
	return (
		<div className={styles.tabs}>
			{ACTIONS.map((a) => (
				<button
					key={a.key}
					className={`${styles.tab} ${
						action === a.key ? styles.active : ''
					}`}
					onClick={() => setAction(a.key)}
					type="button"
				>
					{a.label}
				</button>
			))}
		</div>
	);
}

function StatusMessage({ error, ok }) {
	if (!error && !ok) return null;
	return error ? (
		<p className={styles.error} style={{ gridColumn: '1 / -1' }}>
			{error}
		</p>
	) : (
		<p className={styles.ok} style={{ gridColumn: '1 / -1' }}>
			{ok}
		</p>
	);
}

function VehicleFormFields({
	action,
	plate,
	setPlate,
	modelName,
	setModelName,
	make,
	setMake,
	yearText,
	setYearText,
}) {
	const isDelete = action === 'delete';
	return (
		<>
			<label>Plate</label>
			<input
				value={plate}
				onChange={(e) => setPlate(e.target.value)}
				placeholder="ABC-1234 or ABC1D23"
				required
			/>

			{!isDelete && (
				<>
					<label>Model</label>
					<input
						value={modelName}
						onChange={(e) => setModelName(e.target.value)}
						placeholder="Corolla"
						required={action === 'create'}
					/>

					<label>Manufacturer</label>
					<input
						value={make}
						onChange={(e) => setMake(e.target.value)}
						placeholder="Toyota"
						required={action === 'create'}
					/>

					<label>Year</label>
					<input
						type="number"
						value={yearText}
						onChange={(e) => setYearText(e.target.value)}
						placeholder="2021"
						min="1900"
						max={new Date().getFullYear() + 1}
						required={action === 'create'}
					/>
				</>
			)}
		</>
	);
}

function SubmitButton({ action, loading, isDelete }) {
	const label = useMemo(() => {
		if (loading) return 'Working…';
		if (action === 'create') return 'Create';
		if (action === 'update') return 'Update';
		return 'Delete';
	}, [loading, action]);

	return (
		<button
			type="submit"
			className={`${styles.primary} ${isDelete ? styles.danger : ''}`}
			disabled={loading}
		>
			{label}
		</button>
	);
}

export default function VehicleModal({ initialPlate, onDone }) {
	const { token } = useAuth();

	const [action, setAction] = useState('create');
	const [plate, setPlate] = useState(initialPlate || '');
	const [modelName, setModelName] = useState('');
	const [make, setMake] = useState('');
	const [yearText, setYearText] = useState('');

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [ok, setOk] = useState('');

	useVehiclePrefill({
		enabled: action === 'update',
		plate,
		token,
		setModelName,
		setMake,
		setYearText,
		setError,
	});

	useEffect(() => {
		setError('');
		setOk('');
	}, [action]);

	async function handleSubmit(e) {
		e.preventDefault();
		setError('');
		setOk('');
		setLoading(true);

		const upperPlate = toUpperTrim(plate);
		const yearNumber = parseYearSafe(yearText);

		try {
			if (action === 'create') {
				if (!upperPlate || !modelName || !make || !yearNumber)
					throw new Error('Fill all fields');

				await createVehicle(token, {
					plate: upperPlate,
					model: modelName,
					manufacturer: make,
					year: yearNumber,
				});

				setOk('Vehicle created');
				onDone?.();
			}

			if (action === 'update') {
				if (!upperPlate) throw new Error('Plate is required');

				const payload = {};
				if (modelName) payload.model = modelName;
				if (make) payload.manufacturer = make;
				if (yearText) payload.year = parseYearSafe(yearText);

				await updateVehicle(token, upperPlate, payload);

				setOk('Vehicle updated');
				onDone?.();
			}

			if (action === 'delete') {
				if (!upperPlate) throw new Error('Plate is required');

				await deleteVehicle(token, upperPlate);

				setOk('Vehicle deleted');
				onDone?.();
			}
		} catch (e) {
			setError(e.message);
		} finally {
			setLoading(false);
		}
	}

	const isDelete = action === 'delete';

	return (
		<div>
			<ActionTabs action={action} setAction={setAction} />

			<form className={styles['form-grid']} onSubmit={handleSubmit}>
				<VehicleFormFields
					action={action}
					plate={plate}
					setPlate={setPlate}
					modelName={modelName}
					setModelName={setModelName}
					make={make}
					setMake={setMake}
					yearText={yearText}
					setYearText={setYearText}
				/>

				<StatusMessage error={error} ok={ok} />

				<div
					className={styles.actions}
					style={{ gridColumn: '1 / -1' }}
				>
					<SubmitButton
						action={action}
						loading={loading}
						isDelete={isDelete}
					/>
				</div>
			</form>
		</div>
	);
}
