import React from 'react';
import * as actions from '@/app/actions';

declare global {
    interface Navigator {
        deviceMemory?: number;
        connection?: {
            effectiveType: string;
        }
    }
}

const InfoRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <tr>
        <td className="pr-4 font-medium text-accent">{label.padEnd(15, ' ')}:</td>
        <td>{value}</td>
    </tr>
);

export const sysinfo = async () => {
    if (typeof window === 'undefined') {
        return 'This command can only be run on the client.';
    }

    const uptimeMs = Date.now() - (parseInt(window.sessionStorage.getItem('session-start-time') || String(Date.now()), 10));
    const seconds = Math.floor((uptimeMs / 1000) % 60);
    const minutes = Math.floor((uptimeMs / (1000 * 60)) % 60);
    const hours = Math.floor((uptimeMs / (1000 * 60 * 60)) % 24);
    const uptimeStr = `${hours}h ${minutes}m ${seconds}s`;

    const getBrowser = () => {
        const ua = navigator.userAgent;
        if (ua.includes("Firefox")) return "Mozilla Firefox";
        if (ua.includes("SamsungBrowser")) return "Samsung Internet";
        if (ua.includes("Opera") || ua.includes("OPR")) return "Opera";
        if (ua.includes("Trident")) return "Microsoft Internet Explorer";
        if (ua.includes("Edge")) return "Microsoft Edge";
        if (ua.includes("Chrome")) return "Google Chrome or Chromium";
        if (ua.includes("Safari")) return "Apple Safari";
        return "Unknown";
    };

    const systemInfo = {
        'Browser': getBrowser(),
        'Platform': navigator.platform,
        'CPU Cores': navigator.hardwareConcurrency || 'N/A',
        'Memory': navigator.deviceMemory ? `${navigator.deviceMemory} GB` : 'N/A',
        'Network': navigator.connection?.effectiveType || 'N/A',
        'Language': navigator.language,
        'Timezone': Intl.DateTimeFormat().resolvedOptions().timeZone,
        'Screen resolution': `${window.screen.width}x${window.screen.height}`,
        'Uptime': uptimeStr,
    };

    const ipData: any = await actions.getIpInfo();
    let countryData: any = {};
    if (ipData && !ipData.error) {
        countryData = await actions.getCountryInfo(ipData.country);
    }
    const currencyInfo = countryData && countryData.currencies 
        ? Object.values(countryData.currencies).map((c: any) => c.name).join(', ') 
        : 'N/A';

    const ipInfo = {
        'IP Address': ipData.query || 'N/A',
        'City': ipData.city || 'N/A',
        'Region': ipData.regionName || 'N/A',
        'Country': ipData.country || 'N/A',
        'Postal Code': ipData.zip || 'N/A',
        'Latitude/Long.': ipData.lat && ipData.lon ? `${ipData.lat}, ${ipData.lon}` : 'N/A',
        'Currency': currencyInfo,
        'Time Zone (IP)': ipData.timezone || 'N/A',
        'Org': ipData.org || 'N/A',
        'ASN': ipData.as || 'N/A',
    };

    return (
        <div className="font-mono text-sm">
            <p className="font-bold">SYSTEM INFORMATION</p>
            <p className="font-bold">------------------</p>
            <table>
                <tbody>
                    {Object.entries(systemInfo).map(([key, value]) => (
                        <InfoRow key={key} label={key} value={value} />
                    ))}
                </tbody>
            </table>
            
            <br />

            <p className="font-bold">IP INFORMATION</p>
            <p className="font-bold">--------------</p>
            <table>
                 <tbody>
                    {Object.entries(ipInfo).map(([key, value]) => (
                        <InfoRow key={key} label={key} value={value} />
                    ))}
                </tbody>
            </table>
        </div>
    );
};
