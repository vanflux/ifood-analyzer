import { getCookie } from "./get-cookie";

export interface IfoodCoords {
  latitude: number,
  longitude: number,
}

export function getCoords(): IfoodCoords | undefined {
  const latitude = Number(getCookie('address-latitude'));
  const longitude = Number(getCookie('address-longitude'));
  return !isNaN(latitude) && !isNaN(longitude) ? { latitude, longitude } : undefined;
}
