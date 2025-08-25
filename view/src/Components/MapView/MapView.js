import { GoogleMap, MarkerF, PolylineF, InfoWindowF } from '@react-google-maps/api';
import { useMemo, useState } from 'react';
import styles from "./mapView.module.scss"

export default function MapView({ lastByPlate, historyByPlate, selectedPlate, showHistory }) {
  const center = useMemo(() => {
    const p = selectedPlate ? lastByPlate[selectedPlate] : null;
    return p ? { lat: p.lat, lng: p.lng } : { lat: -8.05, lng: -34.9 };
  }, [lastByPlate, selectedPlate]);

  const [info, setInfo] = useState(null);
  const containerStyle = { width: '100%', height: '100%' };
  const markers = Object.values(lastByPlate);

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
      {markers.map(pt => (
        <MarkerF
          key={pt.plate}
          position={{ lat: pt.lat, lng: pt.lng }}
          label={pt.plate}
          onClick={() => setInfo(pt)}
        />
      ))}

      {showHistory && selectedPlate && historyByPlate[selectedPlate] && (
        <PolylineF
          path={historyByPlate[selectedPlate].map(p => ({ lat: p.lat, lng: p.lng }))}
          options={{ strokeOpacity: 0.8, strokeWeight: 3 }}
        />
      )}

      {info && (
        <InfoWindowF position={{ lat: info.lat, lng: info.lng }} onCloseClick={() => setInfo(null)}>
          <div className={styles.details} >
            <div><strong>{info.plate}</strong></div>
            <div>Speed: {info.speed} km/h</div>
            <div>Fuel: {info.fuel}%</div>
            <div>Updated: {new Date(info.timestamp).toLocaleString()}</div>
          </div>
        </InfoWindowF>
      )}
    </GoogleMap>
  );
}
