'use client';

import Terminal from '@/components/terminal';
import BootMenu from '@/components/boot-menu';
import { useEffect, useState } from 'react';

const BOOT_CHOICE_KEY = 'boot_choice';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [showTerminal, setShowTerminal] = useState(false);

  useEffect(() => {
    const savedChoice = sessionStorage.getItem(BOOT_CHOICE_KEY);
    if (savedChoice === 'it-guy') {
      setShowTerminal(true);
    }
    setLoading(false);
  }, []);

  const handleSelectItGuy = () => {
    sessionStorage.setItem(BOOT_CHOICE_KEY, 'it-guy');
    setShowTerminal(true);
  };

  if (loading) {
    return null; // Don't render anything until client-side check is complete
  }

  return (
    <main role="application">
      {showTerminal ? <Terminal /> : <BootMenu onSelectItGuy={handleSelectItGuy} />}
    </main>
  );
}
