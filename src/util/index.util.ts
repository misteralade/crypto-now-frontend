import millify from "millify";
import {LOCAL_STORAGE_KEYS} from "./constants.util.ts";

export const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
}

export const handleLogout = () => {
  localStorage.removeItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
  window.location.href = "/sign-in";
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

export const getFileType = (file: File) => {
  if (file.type.startsWith('image/')) return 'IMAGE';
  if (file.type.startsWith('video/')) return 'VIDEO';
  if (file.type === 'application/pdf') return 'PDF';
  if (file.type.startsWith('audio/')) return 'AUDIO';
  if (file.name.match(/\.(xls|xlsx|csv)$/)) return 'SPREADSHEET';
  return 'DOCUMENT';
};

export const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};