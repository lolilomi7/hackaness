import { motion } from 'motion/react';

interface LoaderProps {
  label?: string;
}

export default function Loader({ label = 'Thinking...' }: LoaderProps) {
  return (
    <div className="flex flex-col items-center gap-4 text-white">
      <motion.div
        className="h-10 w-10 rounded-full border-4 border-white/30 border-t-white"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      <p className="text-sm text-white/80">{label}</p>
    </div>
  );
}
