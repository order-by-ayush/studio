import Typewriter from './typewriter';
import { ReactNode } from 'react';

type CommandOutputProps = {
  content: ReactNode;
  typingSpeed: number;
};

const CommandOutput = ({ content, typingSpeed }: CommandOutputProps) => {
  if (typeof content === 'string') {
    return <Typewriter text={content} speed={typingSpeed} />;
  }
  // If content is a React node, render it directly.
  return <div>{content}</div>;
};

export default CommandOutput;
