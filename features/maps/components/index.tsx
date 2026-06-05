"use client"

import { MapContainer, TileLayer, GeoJSON, useMap, useMapEvents, Marker, Popup } from "react-leaflet"
import 'leaflet.snogylop'
import { LatLngExpression, LatLngTuple } from "leaflet"
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useState, useEffect} from "react";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface MapProps {
  posix?: LatLngExpression | LatLngTuple;
  zoom?: number;
  onLocationSelect?: (lat: number, lng: number, address: string) => void;
  stores?: { id: string; name: string; lat: number; lng: number }[];
  highlightedStoreId?: string | null;
}

const defaults = {
  zoom: 13
}

function FitBounds({ data }: { data: GeoJSON.FeatureCollection }) {
  const map = useMap();
  useEffect(() => {
    if (!data) return;
    const layer = L.geoJSON(data);
    const bounds = layer.getBounds();
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [20, 20], maxZoom: 13 });
      map.setMaxBounds(bounds.pad(0.05));
      map.setMinZoom(12);
    }
  }, [data, map]);
  return null;
}

function OutsideMask({ cityBoundary }: { cityBoundary: GeoJSON.Feature }) {
  const map = useMap();

  useEffect(() => {
    if (!cityBoundary) return;

    // @ts-ignore
    const layer = L.geoJSON(cityBoundary, {
      invert: true,
      style: {
        stroke: false, // Remove stroke for cleaner look
        fillColor: "#000",
        fillOpacity: 0.4, // Lower opacity so you can see the map underneath
      }
    }).addTo(map);

    return () => {
      map.removeLayer(layer);
    };
  }, [cityBoundary, map]);

  return null;
}

function LocationPicker({ onLocationSelect }: { 
  onLocationSelect: (lat: number, lng: number, address: string) => void 
}) {
  const [marker, setMarker] = useState<[number, number] | null>(null);
  const [address, setAddress] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setMarker([lat, lng]);
      onLocationSelect(lat, lng, "");
    },
  });
  
  return marker ? (
    <Marker position={marker}>
      <Popup>
        {loading ? "Getting address..." : address}
        <br />
        <span style={{ fontSize: '11px', color: '#666' }}>
          {marker[0].toFixed(6)}, {marker[1].toFixed(6)}
        </span>
      </Popup>
    </Marker>
  ) : null;
}

export default function BaybayMaps({ 
  posix = [10.6769, 124.8006], 
  zoom = defaults.zoom, 
  onLocationSelect,
  stores = [],
  highlightedStoreId = null,
}: MapProps) {
  const [boundary, setBoundary] = useState<GeoJSON.FeatureCollection | null>(null);
  const [cityBoundary, setCityBoundary] = useState<GeoJSON.Feature | null>(null);

  useEffect(() => {
    fetch('/BaybayMap.geojson')
      .then(res => res.json())
      .then(data => {
        setBoundary(data);
        setCityBoundary(data.features[0]);
      })
      .catch(err => console.error('Failed to load boundary:', err));
  }, []);

  return (
    <MapContainer
      center={posix}
      zoom={zoom}
      style={{ height: '100%', width: '100%' }}
      maxBoundsViscosity={1.0}
      minZoom={12}
      maxZoom={18}
      zoomSnap={0.5}
      wheelDebounceTime={40}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {onLocationSelect && (
        <LocationPicker onLocationSelect={onLocationSelect} />
      )}

      {boundary && cityBoundary && (
        <>
          <OutsideMask cityBoundary={cityBoundary} />
          <GeoJSON
            data={cityBoundary}
            style={{
              color: "#7c3aed",       // outline color — change to taste
              weight: 2.5,
              fillColor: "rgba(124, 58, 237, 0.1)",
              fillOpacity: 0.3,
            }}
          />

          <FitBounds data={boundary} />
        </>
      )}

      {stores?.map((store) => (
        <Marker
          key={store.id}
          position={[store.lat, store.lng]}
          opacity={highlightedStoreId === null || highlightedStoreId === store.id ? 1 : 0.3}
        >
          <Popup>{store.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}