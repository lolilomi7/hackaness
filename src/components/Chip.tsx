interface ChipProps {
  label: string;
  selected: boolean;
  onSelect: () => void;
}

export default function Chip({ label, selected, onSelect }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={
        'rounded-full border px-4 py-2 text-sm transition-colors ' +
        (selected
          ? 'border-white bg-white/20 text-white'
          : 'border-white/40 bg-white/5 text-white/80')
      }
    >
      {label}
    </button>
  );
}
