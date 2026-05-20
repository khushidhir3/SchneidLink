import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const markerColors = {
    green:  '#3DCD58',
    orange: '#f97316',
    red:    '#ef4444',
    blue:   '#3b82f6',
    purple: '#8b5cf6',
};

function createColoredIcon(color) {
    return L.divIcon({
        className: 'custom-marker',
        html: `<div style="width:24px;height:24px;border-radius:50%;background:${markerColors[color] || color};border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12],
    });
}

export default function MapView({ markers = [], center = [28.6139, 77.2090], zoom = 12, className = '', height = '400px', onMarkerClick }) {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markersLayerRef = useRef(null);

    useEffect(() => {
        if (!mapRef.current || mapInstanceRef.current) return;

        const map = L.map(mapRef.current).setView(center, zoom);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
        }).addTo(map);

        markersLayerRef.current = L.layerGroup().addTo(map);
        mapInstanceRef.current = map;

        return () => { map.remove(); mapInstanceRef.current = null; };
    }, []);

    useEffect(() => {
        if (!markersLayerRef.current) return;
        markersLayerRef.current.clearLayers();

        markers.forEach((m) => {
            if (!m.lat || !m.lng) return;
            const icon = m.color ? createColoredIcon(m.color) : new L.Icon.Default();
            const marker = L.marker([m.lat, m.lng], { icon }).addTo(markersLayerRef.current);

            if (m.popup) marker.bindPopup(m.popup);
            if (onMarkerClick && m.id) marker.on('click', () => onMarkerClick(m));
        });

        if (markers.length > 0) {
            const bounds = L.latLngBounds(markers.filter(m => m.lat && m.lng).map(m => [m.lat, m.lng]));
            if (bounds.isValid()) mapInstanceRef.current?.fitBounds(bounds, { padding: [40, 40] });
        }
    }, [markers]);

    return (
        <div ref={mapRef} className={`rounded-xl overflow-hidden shadow-inner ${className}`} style={{ height, minHeight: '300px' }} />
    );
}
