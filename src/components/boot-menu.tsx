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
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
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
    <div className="fixed inset-0 bg-black text-green-500 font-mono flex flex-col items-center justify-center p-4">
      <div className="border border-green-500 rounded-lg p-8 w-full max-w-md space-y-6">
        <h1 className="text-2xl">Boot Menu</h1>
        <p>Select your profile to continue:</p>
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={() => {
              setSelected('it-guy');
              handleSelection();
            }}
            onMouseEnter={() => setSelected('it-guy')}
            className={cn(
              'border border-green-500 rounded px-6 py-3 flex items-center gap-2 transition-colors duration-200',
              selected === 'it-guy' ? 'bg-green-500 text-black' : 'hover:bg-green-500/20'
            )}
          >
            <ChevronRight size={20} className={cn(selected === 'it-guy' ? 'opacity-100' : 'opacity-0')} />
            <span className={cn(selected === 'it-guy' ? 'animate-blink' : '')}>_</span>
             IT Guy
          </button>
          <button
             onClick={() => {
              setSelected('normal-user');
              handleSelection();
            }}
            onMouseEnter={() => setSelected('normal-user')}
            className={cn(
              'border border-green-500 rounded px-6 py-3 flex items-center gap-2 transition-colors duration-200',
               selected === 'normal-user' ? 'bg-green-500 text-black' : 'hover:bg-green-500/20'
            )}
          >
            <User size={20} />
            Normal User
          </button>
        </div>
      </div>
      <div className="mt-4 text-center">
        <Typewriter text="select to continue" speed={100} />
      </div>
    </div>
  );
};

export default BootMenu;
