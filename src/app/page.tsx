
'use client';

import Terminal from '@/components/terminal';
import BootMenu from '@/components/boot-menu';
import { useEffect, useState } from 'react';

const BOOT_CHOICE_KEY = 'boot_choice';

export default function Home() {
  const [showTerminal, setShowTerminal] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const savedChoice = sessionStorage.getItem(BOOT_CHOICE_KEY);
    if (savedChoice === 'it-guy') {
      setShowTerminal(true);
    }
  }, []);

  const handleSelectItGuy = () => {
    sessionStorage.setItem(BOOT_CHOICE_KEY, 'it-guy');
    setShowTerminal(true);
  };
  
  if (!isClient) {
    return null; // Render nothing on the server to prevent hydration mismatch.
  }

  return (
    <main role="application">
      {showTerminal ? <Terminal /> : <BootMenu onSelectItGuy={handleSelectItGuy} />}
    </main>
  );
}
