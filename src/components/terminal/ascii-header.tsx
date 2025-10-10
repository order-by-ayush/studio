import React from 'react';

const AsciiHeader = () => {
    const logoArt = `
      _/_/_/          _/_/_/    _/_/_/  _/_/_/_/  _/    _/  _/      _/    _/_/_/
   _/              _/    _/  _/    _/  _/        _/    _/    _/  _/    _/    _/
  _/_/_/          _/    _/  _/_/_/_/  _/_/_/    _/    _/      _/      _/_/_/_/
       _/        _/    _/  _/    _/  _/        _/    _/      _/      _/    _/
_/_/_/          _/_/_/    _/    _/  _/_/_/_/    _/_/        _/      _/    _/
`;

    return (
        <div>
            <pre className="text-foreground text-xs md:text-sm">
                {logoArt}
            </pre>
            <p>Welcome to Abhinav's Terminal Portfolio</p>
        </div>
    );
};

export default AsciiHeader;
