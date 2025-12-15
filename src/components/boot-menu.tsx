
'use client';

import { cn } from '@/lib/utils';
import { User, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import Typewriter from './terminal/typewriter';

type BootMenuProps = {
  onSelectItGuy: () => void;
};

const BootMenu = ({ onSelectItGuy }: BootMenuProps) => {
  const [selected, setSelected] = useState<'it-guy' | 'normal-user'>('it-guy');

  const handleSelection = () => {
    if (selected === 'it-guy') {
      onSelectItGuy();
    } else {
      window.location.href = 'https://ayush11profile.netlify.app/';
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft' || e.key === 'Tab') {
        e.preventDefault();
        setSelected(prev => (prev === 'it-guy' ? 'normal-user' : 'it-guy'));
      } else if (e.key === 'Enter') {
        handleSelection();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  return (
    <div className="fixed inset-0 bg-background text-primary font-mono flex flex-col items-center justify-center p-4">
      <div className="border border-primary rounded-lg p-4 md:p-8 w-full max-w-lg space-y-4 md:space-y-6">
        <h1 className="text-xl md:text-2xl">Boot Menu</h1>
        <p>Select your profile to continue:</p>
        <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
          <button
            onClick={() => {
              setSelected('it-guy');
              handleSelection();
            }}
            onMouseEnter={() => setSelected('it-guy')}
            className={cn(
              'border border-primary rounded px-4 py-2 md:px-6 md:py-3 flex items-center gap-2 transition-colors duration-200 w-full md:w-auto justify-center',
              selected === 'it-guy' ? 'bg-primary text-primary-foreground' : 'hover:bg-primary/20'
            )}
          >
            <ChevronRight size={20} className={cn('transition-opacity', selected === 'it-guy' ? 'opacity-100' : 'opacity-0')} />
            <span className={cn(selected === 'it-guy' ? 'cursor-blink' : 'opacity-0')}>_</span>
             IT Guy
          </button>
          <button
             onClick={() => {
              setSelected('normal-user');
              handleSelection();
            }}
            onMouseEnter={() => setSelected('normal-user')}
            className={cn(
              'border border-primary rounded px-4 py-2 md:px-6 md:py-3 flex items-center gap-2 transition-colors duration-200 w-full md:w-auto justify-center',
               selected === 'normal-user' ? 'bg-primary text-primary-foreground' : 'hover:bg-primary/20'
            )}
          >
             <ChevronRight size={20} className={cn('transition-opacity', selected === 'normal-user' ? 'opacity-100' : 'opacity-0')} />
            <User size={20} />
            Normal User
          </button>
        </div>
      </div>
      <div className="mt-4 text-center text-foreground">
        <Typewriter text="select to continue" speed={100} />
      </div>
    </div>
  );
};

export default BootMenu;
