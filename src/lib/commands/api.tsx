import React from 'react';
import * as actions from '@/app/actions';
import { CommandContext } from '.';

export const country = async (args: string[]) => {
  let name = args.join(' ');
  if (!name) {
    const ipData: any = await actions.getIpInfo();
    if (ipData.error || ipData.status === 'fail') {
      return `Could not determine your country from your IP. Please specify a country. Usage: country [name]`;
    }
    name = ipData.country;
  }
  
  const data = await actions.getCountryInfo(name);
  if (data.error) return data.error;
  const currencyInfo = Object.values(data.currencies || {}).map((c: any) => `${c.name} (${c.symbol})`).join(', ');
  return `Country: ${data.name.common}\nCapital: ${data.capital?.[0]}\nPopulation: ${data.population.toLocaleString()}\nRegion: ${data.region}\nCurrencies: ${currencyInfo}`;
};

export const curl = async (args: string[], context: CommandContext) => {
  if (!args.length) {
    context.addOutput('Usage: curl [url]');
    return;
  }
  let url = args[0];
  if (!/^https?:\/\//i.test(url)) {
    url = 'https://' + url;
  }
  const content = await actions.curlUrl(url);
  context.addOutput(<pre className="whitespace-pre-wrap">{content}</pre>);
};

export const dns = async (args: string[]) => {
    if (!args.length) return 'Usage: dns [domain]';
    const domain = args[0];
    
    const [aData, aaaaData]: [any, any] = await Promise.all([
      actions.getDnsInfo(domain),
      actions.getDnsInfo(`${domain}&type=AAAA`)
    ]);

    let output = '';

    if (aData.Answer) {
      const ips = aData.Answer.filter((rec: any) => rec.type === 1).map((rec: any) => rec.data).join('\n');
      output += `IPv4 (A records) for ${domain}:\n${ips}\n`;
    } else {
      output += `No IPv4 (A records) found for ${domain}.\n`;
    }

    if (aaaaData.Answer) {
      const ips = aaaaData.Answer.filter((rec: any) => rec.type === 28).map((rec: any) => rec.data).join('\n');
      output += `\nIPv6 (AAAA records) for ${domain}:\n${ips}`;
    } else {
      output += `\nNo IPv6 (AAAA records) found for ${domain}.`;
    }

    return <pre className="whitespace-pre-wrap">{output}</pre>;
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
    const username = args[0] || 'aayush-xid-su';
    const data: any = await actions.getGithubInfo(username);

    if (data.error || data.message) return data.error || `User ${username} not found.`;
    
    const joinDate = new Date(data.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="flex items-start gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={data.avatar_url} alt={`${data.login}'s avatar`} className="w-16 h-16 rounded-md" />
            <div className="space-y-1">
                <p className="text-lg font-bold">{data.name} (@{data.login})</p>
                <p>Member since: {joinDate}</p>
                <p>Repos: {data.public_repos} | Followers: {data.followers} | Following: {data.following}</p>
                <a href={data.html_url} target="_blank" rel="noopener noreferrer" className="text-accent underline">
                    View Profile
                </a>
            </div>
        </div>
    );
};


export const ip = async (args: string[]) => {
    const ip = args[0];
    const data: any = await actions.getIpInfo(ip);
    if(data.error || data.status === 'fail') return data.error || `Could not get info for IP: ${ip}`;
    return <pre className="whitespace-pre-wrap">{`IP Info for ${data.query}:\nCity: ${data.city}\nRegion: ${data.regionName}\nCountry: ${data.country}\nISP: ${data.isp}\nOrganization: ${data.org}`}</pre>;
};

export const json = async (args: string[]) => {
    if (!args.length) return 'Usage: json [url]';
    const url = args[0];
    const res = await actions.curlUrl(url);
    try {
        const parsed = JSON.parse(res);
        return <pre className="whitespace-pre-wrap">{JSON.stringify(parsed, null, 2)}</pre>
    } catch {
        return 'Error: Fetched content is not valid JSON.';
    }
};

export const ping = async (args: string[]) => {
    if (!args.length) return 'Usage: ping [url]';
    let url = args[0];
    if (!url.startsWith('http')) {
        url = `https://` + url;
    }
    const result = await actions.pingUrl(url);
    if (result.error) return result.error;
    return `Pong! Response from ${url} in ${result.time}ms`;
};

export const shorten = async (args: string[]) => {
    if (!args.length) return 'Usage: shorten [url]';
    const url = args[0];
    const shortUrl = await actions.getShortenedUrl(url);
    return `Shortened URL: ${shortUrl}`;
};

export const weather = async (args: string[], context: CommandContext) => {
    let city: string | undefined = args.join(' ');

    if (!city) {
        if (typeof window !== 'undefined' && navigator.geolocation) {
            try {
                const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
                });
                const { latitude, longitude } = position.coords;
                city = `${latitude},${longitude}`;
            } catch (err: any) {
                context.addOutput(`Could not get your location: ${err.message}. Falling back to IP-based location.`);
                // Let it fall through to the IP-based lookup by leaving city empty
                city = '';
            }
        } else {
            context.addOutput('Geolocation is not available. Falling back to IP-based location.');
            city = '';
        }
    }

    const data: any = await actions.getWeatherInfo(city);
    if (data.error) return data.error;

    const current = data.current_condition[0];
    const today = data.weather[0];

    return <pre className="whitespace-pre-wrap">{`Weather for ${data.nearest_area[0].areaName[0].value}, ${data.nearest_area[0].country[0].value}:\n` +
           `Currently: ${current.weatherDesc[0].value}, ${current.temp_C}°C (feels like ${current.FeelsLikeC}°C)\n` +
           `Wind: ${current.windspeedKmph} km/h from ${current.winddir16Point}\n` +
           `Humidity: ${current.humidity}%\n` +
           `Today's forecast: ${today.hourly[4].weatherDesc[0].value}, high of ${today.maxtempC}°C, low of ${today.mintempC}°C`}</pre>;
};
