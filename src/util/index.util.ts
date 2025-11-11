import millify from "millify";
import {LOCAL_STORAGE_KEYS} from "./constants.util.ts";

export const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
}

export const handleLogout = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
    window.location.href = "/";
}

export const formatNumber = (value: string | number) => {
    return parseFloat(value.toString()).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 8,
    })
}

export const convertToMillify = (num: number, precision: number = 2): string => {
    const safe = Number.isFinite(num) ? num : 0;
    return millify(safe, { precision });
}