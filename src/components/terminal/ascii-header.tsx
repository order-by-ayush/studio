import React from 'react';

const AsciiHeader = () => {
    const logoArt = `
 █████╗ ██╗   ██╗██╗   ██╗███████╗██╗  ██╗
██╔══██╗╚██╗ ██╔╝██║   ██║██╔════╝██║  ██║
███████║ ╚████╔╝ ██║   ██║███████╗███████║
██╔══██║  ╚██╔╝  ██║   ██║╚════██║██╔══██║
██║  ██║   ██║   ╚██████╔╝███████║██║  ██║
╚═╝  ╚═╝   ╚═╝    ╚═════╝ ╚══════╝╚═╝  ╚═╝

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
