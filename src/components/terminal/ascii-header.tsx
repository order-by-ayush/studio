import React from 'react';

const AsciiHeader = () => {
    const logoArt = `
      ___       __  __  _   _   _____  _   _   _
     /   \\     |  \\/  || | | | /  ___|| | | | | |
    /  _  \\    |      || | | || |___  | | | | | |
   /  / \\  \\   | |\\/| || | | ||  ___| | | | | | |
  /  /   \\  \\  | |  | || |_| || |     | |_| | | |
 /__/     \\__\\ |_|  |_| \\___/ |_|      \\___/  |_|
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
