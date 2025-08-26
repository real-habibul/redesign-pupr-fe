"use client";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import * as React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type LatLng = { lat: number; lng: number };

type NominatimItem = {
  lat: string;
  lon: string;
  display_name: string;
};

type Props = {
  center: LatLng;
  value: LatLng;
  onChange: (p: LatLng) => void;
};

const containerStyle: React.CSSProperties = {
  width: "100%",
  height: "400px",
  borderRadius: "16px",
};

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function isValidLatLng(v?: LatLng): v is LatLng {
  return (
    v !== undefined &&
    typeof v.lat === "number" &&
    typeof v.lng === "number" &&
    !Number.isNaN(v.lat) &&
    !Number.isNaN(v.lng) &&
    v.lat >= -90 &&
    v.lat <= 90 &&
    v.lng >= -180 &&
    v.lng <= 180
  );
}

function ClickHandler({ onPick }: { onPick: (p: LatLng) => void }) {
  useMapEvents({
    click(e) {
      onPick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

function InitView({ value }: { value: LatLng }) {
  const map = useMap();
  useEffect(() => {
    if (!isValidLatLng(value)) return;
    map.setView([value.lat, value.lng], 13, { animate: false });
  }, [map, value]);
  return null;
}

function PanToPos({ pos }: { pos: LatLng }) {
  const map = useMap();
  useEffect(() => {
    if (!isValidLatLng(pos)) return;
    map.setView([pos.lat, pos.lng], Math.max(map.getZoom(), 13), {
      animate: true,
    });
  }, [map, pos]);
  return null;
}

function parseCoords(inputRaw: string): LatLng | null {
  const input = inputRaw.replace(/\u2212/g, "-").trim();
  const m = input.match(
    /^\s*(-?\d{1,3}(?:\.\d+)?)\s*[, ]\s*(-?\d{1,3}(?:\.\d+)?)\s*$/
  );
  if (!m) return null;
  const lat = parseFloat(m[1]);
  const lng = parseFloat(m[2]);
  if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;
  return { lat, lng };
}

export default function MapPickerInner({ center, value, onChange }: Props) {
  const [pos, setPos] = useState<LatLng>(value);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<NominatimItem[]>([]);
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState<number>(-1);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<number | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setPos(value);
  }, [value]);

  const onPick = useCallback(
    (p: LatLng) => {
      setPos(p);
      onChange(p);
    },
    [onChange]
  );

  const selectItem = useCallback(
    (item: NominatimItem) => {
      const lat = parseFloat(item.lat);
      const lng = parseFloat(item.lon);
      const p = { lat, lng };
      setPos(p);
      onChange(p);
      setQuery(item.display_name);
      setSuggestions([]);
      setOpen(false);
      setHighlight(-1);
    },
    [onChange]
  );

  const searchAddress = useCallback((text: string) => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);

    const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=0&limit=8&q=${encodeURIComponent(
      text
    )}`;

    fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        Referer: typeof window !== "undefined" ? window.location.origin : "",
        "User-Agent": "ekatalog-sipasti/1.0",
      },
    })
      .then((r) => r.json())
      .then((data: NominatimItem[]) => {
        setSuggestions(Array.isArray(data) ? data : []);
        setOpen(true);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      setQuery(v);

      const coords = parseCoords(v);
      if (coords) {
        setSuggestions([]);
        setOpen(false);
        setHighlight(-1);
        setPos(coords);
        onChange(coords);
        return;
      }

      if (!v.trim()) {
        setSuggestions([]);
        setOpen(false);
        setHighlight(-1);
        return;
      }
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
      debounceRef.current = window.setTimeout(() => searchAddress(v), 300);
    },
    [onChange, searchAddress]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!open || suggestions.length === 0) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlight((h) => (h + 1) % suggestions.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlight((h) => (h - 1 + suggestions.length) % suggestions.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        const idx = highlight >= 0 ? highlight : 0;
        selectItem(suggestions[idx]);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    },
    [open, suggestions, highlight, selectItem]
  );

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const leafletCenter = useMemo<[number, number]>(
    () => [pos.lat, pos.lng],
    [pos]
  );

  return (
    <div className="space-y-6" ref={containerRef}>
      <div className="relative z-30" style={{ borderRadius: 16 }}>
        <div style={{ position: "relative" }}>
          <input
            type="text"
            placeholder="Cari lokasi… atau ketik koordinat: -6.2, 106.8"
            value={query}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => suggestions.length > 0 && setOpen(true)}
            style={{
              padding: "10px 40px 10px 12px",
              borderRadius: 12,
              border: "1px solid #ccc",
              width: "100%",
              outline: "none",
              background: "#fff",
            }}
          />
          {query && (
            <button
              type="button"
              aria-label="Clear"
              onClick={() => {
                setQuery("");
                setSuggestions([]);
                setOpen(false);
                setHighlight(-1);
              }}
              style={{
                position: "absolute",
                right: 8,
                top: "50%",
                transform: "translateY(-50%)",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontSize: 18,
                lineHeight: 1,
              }}>
              ×
            </button>
          )}
        </div>

        {open && (
          <div
            className="absolute left-0 right-0 z-40"
            style={{
              top: 44,
              background: "#fff",
              border: "1px solid #ccc",
              borderRadius: 8,
              boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
              maxHeight: 300,
              overflowY: "auto",
            }}>
            {loading ? (
              <div style={{ padding: 10, fontSize: 14 }}>Searching…</div>
            ) : suggestions.length === 0 ? (
              <div style={{ padding: 10, fontSize: 14 }}>No results</div>
            ) : (
              suggestions.map((s, i) => (
                <div
                  key={`${s.lat},${s.lon}-${i}`}
                  onClick={() => selectItem(s)}
                  onMouseEnter={() => setHighlight(i)}
                  style={{
                    padding: 10,
                    cursor: "pointer",
                    background: highlight === i ? "#f5f5f5" : "#fff",
                    borderBottom: "1px solid #eee",
                    fontSize: 14,
                  }}>
                  {s.display_name}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <div className="relative z-10" style={containerStyle}>
        <MapContainer
          center={[center.lat, center.lng]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap contributors"
          />
          <Marker position={leafletCenter} icon={markerIcon} />
          <ClickHandler onPick={onPick} />
          <InitView value={value} />
          <PanToPos pos={pos} />
        </MapContainer>
      </div>
    </div>
  );
}
