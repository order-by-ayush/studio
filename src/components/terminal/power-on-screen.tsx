'use client';

import React, { useEffect, useState } from 'react';
import Typewriter from './typewriter';
import { Progress } from '@/components/ui/progress';

const powerOnMessages = `[SYSTEM] Resuming Network Manager...
[NETWORK] Connection restored
[DEVICE] Filesystems mounted
[SECURITY] Firewalls active

GETTING SYSTEM READY...`;

type PowerOnScreenProps = {
  onFinished: () => void;
};

const PowerOnScreen = ({ onFinished }: PowerOnScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [messagesFinished, setMessagesFinished] = useState(false);

  useEffect(() => {
    if (messagesFinished) {
      const timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(timer);
            setTimeout(onFinished, 300); // Small delay before finishing
            return 100;
          }
          return prev + 2;
        });
      }, 50);
      return () => clearInterval(timer);
    }
  }, [messagesFinished, onFinished]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center h-full w-full">
      <div className="text-left font-mono w-[400px] space-y-4">
        <Typewriter
          text={powerOnMessages}
          speed={50}
          onFinished={() => setMessagesFinished(true)}
        />
        {messagesFinished && <Progress value={progress} className="w-full h-2" />}
      </div>
    </div>
  );
};

export default PowerOnScreen;
