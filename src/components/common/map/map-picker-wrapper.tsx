"use client";
import dynamic from "next/dynamic";

const MapPicker = dynamic(() => import("./map-picker"), {
  ssr: false,
});

export default MapPicker;
