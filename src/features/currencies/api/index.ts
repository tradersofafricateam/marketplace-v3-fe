import { axiosInstance } from "@/lib/axiosInstance";
import { normalizeCurrencies } from "../helpers";

export async function getCurrencies(locale: string, signal?: AbortSignal) {
  const { data } = await axiosInstance.get<{ success: boolean; data: unknown }>("/currencies", {
    headers: { "Accept-Language": locale }, signal,
  });
  if (data.success === false) throw new Error("Could not load currencies");
  return normalizeCurrencies(data.data);
}
