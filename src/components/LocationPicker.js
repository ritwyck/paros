import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";

// Fix Leaflet's default icon URLs
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position === null ? null : (
    <Marker position={position}>
      <Popup>Your selected location</Popup>
    </Marker>
  );
}

export default function LocationPicker({ location, setLocation }) {
  // Default center: San Francisco
  const defaultPos = { lat: 37.7749, lng: -122.4194 };

  const [position, setPosition] = useState(location || null);

  useEffect(() => {
    if (position) {
      setLocation(position);
    }
  }, [position, setLocation]);

  return (
    <div style={{ height: 300, width: "100%", marginBottom: 12 }}>
      <MapContainer center={position || defaultPos} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker position={position} setPosition={setPosition} />
      </MapContainer>
      <small>Click map to set your approximate location</small>
    </div>
  );
}
