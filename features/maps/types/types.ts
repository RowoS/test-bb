import * as L from 'leaflet';

declare module 'leaflet' {
  interface GeoJSONOptions {
    invert?: boolean;
  }
}



export interface ConfirmedLocation {
  geolocation: {
    latitude: number;
    longitude: number;
  };
  address: string;
}

export interface LocationInfo {
  lat: number;
  lng: number;
  barangay: string | null;
  fullAddress: string | null;
  isInBaybay: boolean;
}

export interface UseMapOverlayReturn {
  location: LocationInfo | null;
  geocoding: boolean;
  handleLocationSelect: (lat: number, lng: number) => Promise<void>;
  handleConfirm: () => void;
}

export interface UseMapOverlayOptions {
  onConfirm: (result: ConfirmedLocation) => void;
  onClose: () => void;
}

export interface GeocodeResult {
  barangay: string | null;
  fullAddress: string | null;
  isInBaybay: boolean;
}

export interface UseLocationPickerOptions {
  onLocationSelect: (lat: number, lng: number) => void;
}

export interface UseLocationPickerReturn {
  marker: [number, number] | null;
}