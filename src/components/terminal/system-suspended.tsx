
import React from 'react';
import { Power } from 'lucide-react';
import { cn } from '@/lib/utils';
import Typewriter from './typewriter';

type SystemSuspendedProps = {
  onPowerOn: () => void;
};

const SystemSuspended = ({ onPowerOn }: SystemSuspendedProps) => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center h-full w-full text-center">
      <div className="space-y-8">
        <p className="text-2xl">[ SYSTEM SUSPENDED ]</p>
        <div className="text-lg">
           <Typewriter text="Awaiting user reactivation..." speed={50} />
        </div>
        <button
          onClick={onPowerOn}
          className="group focus:outline-none"
          aria-label="Power on system"
        >
          <Power
            className={cn(
              'h-24 w-24 text-gray-500 transition-all duration-300',
              'group-hover:text-white group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.7)]',
              'group-focus:text-white group-focus:scale-110 group-focus:drop-shadow-[0_0_15px_rgba(255,255,255,0.7)]'
            )}
          />
        </button>
      </div>
    </div>
  );
};

export default SystemSuspended;
