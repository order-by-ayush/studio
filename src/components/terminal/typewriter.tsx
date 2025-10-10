"use client"

import { useState, useEffect, useRef, useMemo } from 'react';

type TypewriterProps = {
  text: string;
  speed?: number;
  className?: string;
  as?: React.ElementType;
};

const Typewriter = ({ text, speed = 50, className, as: Component = 'div' }: TypewriterProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const index = useRef(0);

  const isMultiLine = useMemo(() => text.includes('\n'), [text]);

  useEffect(() => {
    setDisplayedText('');
    index.current = 0;
    
    if (speed === 0) {
      setDisplayedText(text);
      return;
    }

    const intervalId = setInterval(() => {
      if (index.current < text.length) {
        setDisplayedText((prev) => prev + text.charAt(index.current));
        index.current += 1;
      } else {
        clearInterval(intervalId);
      }
    }, speed);

    return () => clearInterval(intervalId);
  }, [text, speed]);

  const containerStyle = isMultiLine ? { whiteSpace: 'pre-wrap' as 'pre-wrap' } : {};

  return (
    <Component className={className} style={containerStyle}>
      {displayedText}
      <span className="inline-block w-2 h-4 ml-1 align-middle bg-foreground animate-blink"></span>
    </Component>
  );
};

export default Typewriter;
