'use client';
import { getWeatherInfo } from 'app/actions';
import { Maximize, Sun } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const TopBar = () => {
    const [weather, setWeather] = useState('Fetching weather...');
    const [currentTime, setCurrentTime] = useState('');
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);

        const fetchUserWeather = () => {
            getWeatherInfo().then((ipWeather: any) => {
                 if (ipWeather && !ipWeather.error) {
                    const area = ipWeather.nearest_area[0];
                    setWeather(`${area.areaName[0].value} ${ipWeather.current_condition[0].temp_C}°C`);
                } else {
                    setWeather('Weather unavailable');
                }
            });
        };

        fetchUserWeather();

        const timer = setInterval(() => {
            const now = new Date();
            const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            const dateString = now.toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' });
            setCurrentTime(`${dateString} ${timeString}`);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };

    return (
        <div className="fixed top-0 left-0 right-0 bg-black text-white flex justify-between items-center px-4 py-1 text-sm font-mono z-20">
            <div className="flex items-center gap-2">
                <Sun size={16} />
                <span>{weather}</span>
            </div>
            <div>
                <a href="https://www.github.com/aayush-xid-su" target="_blank" rel="noopener noreferrer">https://www.github.com/aayush-xid-su</a>
            </div>
            <div className="flex items-center gap-2">
                <span>{isClient ? currentTime : ''}</span>
                <button onClick={toggleFullscreen} className="focus:outline-none">
                    <Maximize size={16} />
                </button>
            </div>
        </div>
    );
};

export default TopBar;
