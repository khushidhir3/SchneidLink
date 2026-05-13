import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default icon path issues with webpack/vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const technicianIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/2815/2815428.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const runningIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3062/3062634.png',
  iconSize: [44, 44],
  iconAnchor: [22, 44],
  popupAnchor: [0, -44],
});

const questIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36],
});

export default function MapSection({ quests, technicians, onAcceptQuest }) {
  return (
    <MapContainer
      center={[28.6139, 77.2090]}
      zoom={14}
      scrollWheelZoom={true}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />

      {/* Quest Markers */}
      {quests.map(function(quest, i) {
        var lat = 28.6139;
        var lng = 77.2090;
        if (quest.location && quest.location.coordinates) {
          lat = quest.location.coordinates[1];
          lng = quest.location.coordinates[0];
        }
        return (
          <Marker key={quest._id || 'quest-' + i} position={[lat, lng]} icon={questIcon}>
            <Popup>
              <div style={{ fontFamily: 'Inter, sans-serif', minWidth: '180px' }}>
                <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '6px' }}>⚙️ Quest: {quest.required_skill || 'Software'}</div>
                <div style={{ fontSize: '12px', color: '#555' }}>Priority: <strong>{quest.priority || 'high'}</strong></div>
                <div style={{ fontSize: '12px', color: '#555' }}>Status: <strong style={{ color: quest.status === 'accepted' ? '#16a34a' : '#eab308' }}>{quest.status}</strong></div>
                {quest.status === 'pending' && (
                  <button
                    onClick={function() { onAcceptQuest(quest._id); }}
                    style={{
                      marginTop: '8px', width: '100%', padding: '8px',
                      backgroundColor: '#16a34a', color: '#fff',
                      border: 'none', borderRadius: '6px', cursor: 'pointer',
                      fontWeight: 600, fontSize: '13px',
                    }}
                  >
                    ⚔️ Accept Quest
                  </button>
                )}
              </div>
            </Popup>
          </Marker>
        );
      })}

      {/* Technician Markers */}
      {technicians.map(function(tech) {
        return (
          <Marker
            key={tech.id}
            position={[tech.lat, tech.lng]}
            icon={tech.status === 'running' ? runningIcon : technicianIcon}
          >
            <Popup>
              <div style={{ fontFamily: 'Inter, sans-serif' }}>
                <div style={{ fontWeight: 700, fontSize: '14px' }}>👷 {tech.name}</div>
                <div style={{ fontSize: '12px', marginTop: '4px' }}>
                  Status: <span style={{ color: tech.status === 'running' ? '#16a34a' : '#eab308', fontWeight: 700 }}>
                    {tech.status === 'running' ? '🏃 RUNNING' : '💤 IDLE'}
                  </span>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}

      {/* 50km dispatch radius visualization */}
      <Circle
        center={[28.6139, 77.2090]}
        radius={5000}
        pathOptions={{ color: '#22c55e', fillColor: '#22c55e', fillOpacity: 0.05, weight: 1, dashArray: '5 5' }}
      />
    </MapContainer>
  );
}
