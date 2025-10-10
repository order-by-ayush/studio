import React from 'react';
import * as actions from '@/app/actions';
import { getDictionaryInfo } from '@/app/actions';

export const antonym = async (args: string[]) => {
  if (!args.length) return 'Usage: antonym [word]';
  const word = args[0];
  const data = await getDictionaryInfo(word);
  if (data.error) return data.error;

  const antonyms = data.meanings?.flatMap((m: any) => m.antonyms).filter(Boolean);
  if (!antonyms || antonyms.length === 0) {
    return `No antonyms found for "${word}".`;
  }
  return `Antonyms for ${word}: ${antonyms.join(', ')}`;
};

export const country = async (args: string[]) => {
  if (!args.length) return 'Usage: country [name]';
  const name = args.join(' ');
  const data = await actions.getCountryInfo(name);
  if (data.error) return data.error;
  const currencyInfo = Object.values(data.currencies || {}).map((c: any) => `${c.name} (${c.symbol})`).join(', ');
  return `Country: ${data.name.common}\nCapital: ${data.capital?.[0]}\nPopulation: ${data.population.toLocaleString()}\nRegion: ${data.region}\nCurrencies: ${currencyInfo}`;
};

export const curl = async (args: string[]) => {
  if (!args.length) return 'Usage: curl [url]';
  const url = args[0];
  const content = await actions.curlUrl(url);
  return content.length > 2000 ? content.substring(0, 2000) + '... (truncated)' : content;
};

export const define = async (args: string[]) => {
  if (!args.length) return 'Usage: define [word]';
  const word = args[0];
  const data = await actions.getDictionaryInfo(word);
  if (data.error) return data.error;

  const phonetics = data.phonetics?.find((p: any) => p.text)?.text;
  const meanings = data.meanings?.map((m: any, i: number) => 
    `\n${i+1}. (${m.partOfSpeech}) ${m.definitions[0].definition}`
  ).join('');

  return `Definition of ${word} ${phonetics ? `(${phonetics})` : ''}:${meanings}`;
};

export const dns = async (args: string[]) => {
    if (!args.length) return 'Usage: dns [domain]';
    const domain = args[0];
    const data: any = await actions.getDnsInfo(domain);
    if (data.error || !data.Answer) return data.error || 'No DNS records found.';
    const ips = data.Answer.filter((rec: any) => rec.type === 1).map((rec: any) => rec.data).join(', ');
    return `A records for ${domain}: ${ips}`;
};
export const dnslookup = dns;

export const geo = async (args: string[]) => {
    if (!args.length) return 'Usage: geo [lat,lon]';
    const [lat, lon] = args.join('').split(',');
    if(!lat || !lon) return 'Invalid format. Usage: geo [lat,lon]';
    const data: any = await actions.getGeoInfo(lat, lon);
    if (data.error) return data.error;
    return `Location: ${data.display_name}`;
};

export const github = async (args: string[]) => {
    const username = args[0] || 'ayushs-2k1';
    const data: any = await actions.getGithubInfo(username);
    if (data.error || data.message) return data.error || `User ${username} not found.`;
    return `GitHub user: ${data.login}\nName: ${data.name}\nBio: ${data.bio}\nFollowers: ${data.followers}\nFollowing: ${data.following}\nPublic Repos: ${data.public_repos}\nProfile: ${data.html_url}`;
};

export const ip = async (args: string[]) => {
    const ip = args[0];
    const data: any = await actions.getIpInfo(ip);
    if(data.error || data.status === 'fail') return data.error || `Could not get info for IP: ${ip}`;
    return `IP Info for ${data.query}:\nCity: ${data.city}\nRegion: ${data.regionName}\nCountry: ${data.country}\nISP: ${data.isp}\nOrganization: ${data.org}`;
};

export const json = async (args: string[]) => {
    if (!args.length) return 'Usage: json [url]';
    const url = args[0];
    const res = await actions.curlUrl(url);
    try {
        const parsed = JSON.parse(res);
        return <pre>{JSON.stringify(parsed, null, 2)}</pre>
    } catch {
        return 'Error: Fetched content is not valid JSON.';
    }
};

export const ping = async (args: string[]) => {
    if (!args.length) return 'Usage: ping [url]';
    let url = args[0];
    if (!url.startsWith('http')) {
        url = `https://${url}`;
    }
    const result = await actions.pingUrl(url);
    if (result.error) return result.error;
    return `Pong! Response from ${url} in ${result.time}ms`;
};

export const quote = async () => {
    const data: any = await actions.getQuote();
    if(data.error) return data.error;
    return `"${data.content}"\n- ${data.author}`;
};

export const shorten = async (args: string[]) => {
    if (!args.length) return 'Usage: shorten [url]';
    const url = args[0];
    const shortUrl = await actions.getShortenedUrl(url);
    return `Shortened URL: ${shortUrl}`;
};

export const stock = async (args: string[]) => {
    if(!args.length) return 'Usage: stock [ticker]';
    const ticker = args[0];
    const data: any = await actions.getStockInfo(ticker);
    const quote = data?.['Global Quote'];
    if(!quote || Object.keys(quote).length === 0) return `Could not find stock data for ticker: ${ticker}`;
    const price = parseFloat(quote['05. price']).toFixed(2);
    const change = parseFloat(quote['09. change']).toFixed(2);
    const changePercent = parseFloat(quote['10. change percent']).toFixed(2);

    return `${quote['01. symbol']}: $${price} | Change: $${change} (${changePercent}%)`;
};

export const synonym = async (args: string[]) => {
  if (!args.length) return 'Usage: synonym [word]';
  const word = args[0];
  const data = await getDictionaryInfo(word);
  if (data.error) return data.error;

  const synonyms = data.meanings?.flatMap((m: any) => m.synonyms).filter(Boolean);
  if (!synonyms || synonyms.length === 0) {
    return `No synonyms found for "${word}".`;
  }
  return `Synonyms for ${word}: ${synonyms.join(', ')}`;
};

export const translate = async (args: string[]) => {
    if (args.length < 1) return 'Usage: translate [text] [to_lang?]';
    const to = args.length > 1 ? args[args.length - 1] : 'es';
    const text = args.length > 1 ? args.slice(0, -1).join(' ') : args.join(' ');

    const data: any = await actions.getTranslatedText(text, to);
    if(data.error) return data.error;
    return data.translatedText;
};

export const weather = async (args: string[], context) => {
    let city: string | undefined = args.join(' ');

    if (!city) {
        // Simple client-side location request
        if(typeof window !== 'undefined' && navigator.geolocation) {
            try {
                const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
                });
                const {latitude, longitude} = position.coords;
                city = `${latitude},${longitude}`;
            } catch (err: any) {
                 context.addOutput(`Could not get your location: ${err.message}. Falling back to IP-based location.`);
                 // Let it fall through to the IP-based lookup
            }
        } else {
            context.addOutput('Geolocation is not available. Falling back to IP-based location.');
        }
    }
    
    const data: any = await actions.getWeatherInfo(city); // Will use IP if city is empty
    if (data.error) return data.error;

    const current = data.current_condition[0];
    const today = data.weather[0];

    return `Weather for ${data.nearest_area[0].areaName[0].value}, ${data.nearest_area[0].country[0].value}:\n` +
           `Currently: ${current.weatherDesc[0].value}, ${current.temp_C}°C (feels like ${current.FeelsLikeC}°C)\n` +
           `Wind: ${current.windspeedKmph} km/h from ${current.winddir16Point}\n` +
           `Humidity: ${current.humidity}%\n` +
           `Today's forecast: ${today.hourly[4].weatherDesc[0].value}, high of ${today.maxtempC}°C, low of ${today.mintempC}°C`;
};
