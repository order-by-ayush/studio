"use client"

import { useState, useEffect, useRef, useMemo } from 'react';

type TypewriterProps = {
  text: string;
  speed?: number;
  className?: string;
  as?: React.ElementType;
  onFinished?: () => void;
};

const Typewriter = ({ text, speed = 50, className, as: Component = 'div', onFinished }: TypewriterProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isFinished, setIsFinished] = useState(false);
  const index = useRef(0);
  const onFinishedRef = useRef(onFinished);

  // Update the ref if the onFinished prop changes
  useEffect(() => {
    onFinishedRef.current = onFinished;
  }, [onFinished]);

  const isMultiLine = useMemo(() => text.includes('\n'), [text]);

  useEffect(() => {
    setDisplayedText('');
    setIsFinished(false);
    index.current = 0;
    
    if (speed === 0) {
      setDisplayedText(text);
      setIsFinished(true);
      return;
    }

    const intervalId = setInterval(() => {
      if (index.current < text.length) {
        setDisplayedText((prev) => prev + text.charAt(index.current));
        index.current += 1;
      } else {
        clearInterval(intervalId);
        setIsFinished(true);
      }
    }, speed);

    return () => clearInterval(intervalId);
  }, [text, speed]);

  useEffect(() => {
    if(isFinished && onFinishedRef.current) {
        onFinishedRef.current();
    }
  }, [isFinished]);

  const containerStyle = isMultiLine ? { whiteSpace: 'pre-wrap' as 'pre-wrap' } : {};

  return (
    <Component className={className} style={containerStyle}>
      {displayedText}
      {!isFinished && <span className="cursor-blink bg-foreground w-2 h-[1.2em] inline-block ml-1 align-middle"></span>}
    </Component>
  );
};

export default Typewriter;
