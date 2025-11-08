import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const truncateHash = (hash: string, startChars = 4, endChars = 4) => {
  return `${hash.slice(0, startChars)}...${hash.slice(-endChars)}`;
};

export const weiToEther = (wei: string, decimals = 6) => {
  const ether = parseFloat(wei) / 1e18;
  if(ether.toFixed(decimals) === '0.000000') {
    return '<0.000001';
  }else {
    if(parseFloat(ether.toFixed(decimals)) < parseFloat(ether.toFixed(18))) {
      return `~${ether.toFixed(decimals)}`;
    }
    return ether.toFixed(decimals);
  }
};