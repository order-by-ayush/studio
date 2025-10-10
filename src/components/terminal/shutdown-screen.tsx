'use client';

import React, { useEffect, useState } from 'react';
import Typewriter from './typewriter';

const shutdownMessages = `[ OK ] Stopping Network Manager...
[ OK ] Disconnecting active network interfaces...
[ OK ] Stopping User Sessions...
[ OK ] Terminating background services...
[ OK ] Stopping System Logging...
[ OK ] Stopping Authorization Manager...
[ OK ] Saving system clock...
[ OK ] Unmounting /home...
[ OK ] Unmounting /var...
[ OK ] Disabling Swap...
[ OK ] All file systems unmounted.
[ OK ] Reached target Shutdown.
[ *  ] Powering off...

SYSTEM IS GOING TO SLEEP NOW.`;

type ShutdownScreenProps = {
  onFinished: () => void;
  playSound: () => void;
};

const ShutdownScreen = ({ onFinished, playSound }: ShutdownScreenProps) => {
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (isFinished) {
      playSound();
      setTimeout(onFinished, 500); // Wait a bit before showing the final suspended screen
    }
  }, [isFinished, onFinished, playSound]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center h-full w-full">
      <div className="text-left font-mono">
        <Typewriter
          text={shutdownMessages}
          speed={50}
          onFinished={() => setIsFinished(true)}
        />
      </div>
    </div>
  );
};

export default ShutdownScreen;
