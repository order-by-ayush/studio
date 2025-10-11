import React from 'react';

const AsciiHeader = () => {
    const logoArt = `
    _    _   _  _ __  _   _ 
   / \\  | | | || '__|| | | |
  / _ \\ | |_| || |   | |_| |
 / ___ \\|  _  || |   |  _  |
/_/   \\_\\_| |_||_|   |_| |_|
`;

    return (
        <div>
            <pre className="text-foreground text-xs md:text-sm">
                {logoArt}
            </pre>
            <p>Welcome to Ayush Das's Terminal</p>
        </div>
    );
};

export default AsciiHeader;
