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
            <pre className="text-foreground text-[0.5rem] leading-tight md:text-sm md:leading-normal">
                {logoArt}
            </pre>
            <p>Welcome to Ayush's Terminal</p>
        </div>
    );
};

export default AsciiHeader;
