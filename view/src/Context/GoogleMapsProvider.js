import { useJsApiLoader } from '@react-google-maps/api';

const MAPS_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

export default function GoogleMapsProvider({ children }) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script', 
    googleMapsApiKey: MAPS_KEY,
  });

  if (loadError) return <div className="map">Failed to load Google Maps</div>;
  if (!isLoaded) return <div className="map">Loading map…</div>;

  return children;
}
