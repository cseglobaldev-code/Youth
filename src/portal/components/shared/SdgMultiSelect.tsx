import { tokens } from '@/config/theme/tokens';
import { SDGS_DATA } from '@/data/sdgs';

interface SdgMultiSelectProps {
  value?: number[];
  onChange?: (value: number[]) => void;
  max?: number;
}

export function SdgMultiSelect({ value = [], onChange, max = 3 }: SdgMultiSelectProps) {
  const handleToggle = (id: number) => {
    let next: number[];
    if (value.includes(id)) {
      next = value.filter((v) => v !== id);
    } else {
      if (max && value.length >= max) return;
      next = [...value, id];
    }
    onChange?.(next);
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {SDGS_DATA.map((sdg) => {
          const isSelected = value.includes(sdg.id);
          const color = tokens.colors.sdg[sdg.id as keyof typeof tokens.colors.sdg] || '#005D9A';

          return (
            <button
              key={sdg.id}
              type="button"
              onClick={() => handleToggle(sdg.id)}
              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer"
              style={{
                backgroundColor: isSelected ? color : '#F1F5F9',
                color: isSelected ? '#FFFFFF' : '#334155',
                border: isSelected ? `1px solid ${color}` : '1px solid #E2E8F0',
                transform: isSelected ? 'scale(1.03)' : 'scale(1)',
              }}
            >
              <span>#{sdg.id}</span>
              <span className="hidden sm:inline">{sdg.title}</span>
            </button>
          );
        })}
      </div>
      <p className="text-xs text-neutral-400 m-0">
        Selected: <strong>{value.length}</strong> / {max} SDGs
      </p>
    </div>
  );
}