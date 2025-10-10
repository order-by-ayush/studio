"use server";

import { z } from "zod";

const fetchText = async (url: string) => {
  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      return `Error: Failed to fetch with status ${response.status}`;
    }
    return await response.text();
  } catch (error) {
    return `Error: ${(error as Error).message}`;
  }
};

const fetchJson = async <T>(url: string): Promise<T | { error: string }> => {
  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!response.ok) {
      return { error: `API request failed with status ${response.status}` };
    }
    return await response.json();
  } catch (error) {
    return { error: `Network error: ${(error as Error).message}` };
  }
};

export async function getDictionaryInfo(word: string) {
  const data = await fetchJson<any[]>(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
  if ("error" in data || !data || data.length === 0) {
    return { error: `Could not find definitions for "${word}".` };
  }
  return data[0];
}

export async function getCountryInfo(name: string) {
  const data = await fetchJson<any[]>(`https://restcountries.com/v3.1/name/${name}?fields=capital,population,region,currencies,name`);
  if ("error" in data || !data || data.length === 0) {
    return { error: `Could not find country "${name}".` };
  }
  return data[0];
}

export async function getDnsInfo(domain: string) {
  return fetchJson(`https://dns.google/resolve?name=${domain}&type=A`);
}

export async function getGeoInfo(lat: string, lon: string) {
  return fetchJson(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
}

export async function getGithubInfo(username: string) {
  return fetchJson(`https://api.github.com/users/${username}`);
}

export async function getIpInfo(ip?: string) {
  const url = ip ? `http://ip-api.com/json/${ip}` : "http://ip-api.com/json/";
  return fetchJson(url);
}

export async function getQuote() {
  return fetchJson("https://api.quotable.io/random");
}

export async function getShortenedUrl(url: string) {
  return fetchText(`http://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
}

export async function getStockInfo(ticker: string) {
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY || "demo";
  if (apiKey === "demo") {
    console.warn("Using demo Alpha Vantage API key. Please set ALPHA_VANTAGE_API_KEY in your environment.");
  }
  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${apiKey}`;
  return fetchJson(url);
}

export async function getTranslatedText(text: string, to: string = "es") {
  try {
    const response = await fetch("https://libretranslate.com/translate", {
      method: "POST",
      body: JSON.stringify({
        q: text,
        source: "auto",
        target: to,
      }),
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) {
      return { error: "Translation service failed." };
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return { error: `Network error: ${(error as Error).message}` };
  }
}

export async function getWeatherInfo(city?: string) {
    const url = city ? `https://wttr.in/${city}?format=j1` : 'https://wttr.in/?format=j1';
    return fetchJson(url);
}

export async function curlUrl(url: string) {
    return fetchText(url);
}

export async function pingUrl(url: string) {
    const start = performance.now();
    try {
        await fetch(url, {method: 'HEAD', cache: 'no-store'});
        const end = performance.now();
        return { time: Math.round(end - start) };
    } catch (error) {
        return { error: `Failed to ping ${url}. ${(error as Error).message}`};
    }
}
