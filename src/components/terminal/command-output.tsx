import Typewriter from './typewriter';

type CommandOutputProps = {
  content: React.ReactNode;
  typingSpeed: number;
};

const CommandOutput = ({ content, typingSpeed }: CommandOutputProps) => {
  if (typeof content === 'string') {
    return <Typewriter text={content} speed={typingSpeed} />;
  }
  return <div>{content}</div>;
};

export default CommandOutput;
