"use client";
import dynamic from "next/dynamic";
import * as React from "react";

const InnerMapPicker = dynamic(() => import("./map-picker-inner"), {
  ssr: false,
});

export type LatLng = { lat: number; lng: number };

type Props = {
  center: LatLng;
  value: LatLng;
  onChange: (p: LatLng) => void;
};

export default function MapPicker(props: Props) {
  return <InnerMapPicker {...props} />;
}
