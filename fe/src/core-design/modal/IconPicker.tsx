import  { useMemo, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

export type IconName = keyof typeof LucideIcons;

type IconPickerContentProps = {
  selectedIcon: IconName;
  onSelect: (iconName: IconName) => void;
  onClose: () => void;
};

const isLucideIcon = (icon: unknown): icon is LucideIcon =>
  typeof icon === 'function' || typeof icon === 'object';

export function IconPickerContent({
  selectedIcon,
  onSelect,
  onClose,
}: IconPickerContentProps) {
  const [search, setSearch] = useState('');

  const filteredIcons = useMemo<IconName[]>(() => {
    const iconKeys = (Object.keys(LucideIcons) as IconName[]).filter((key) =>
      /^[A-Z]/.test(key)
    );

    const filtered = search
      ? iconKeys.filter((iconName) =>
          iconName.toLowerCase().includes(search.toLowerCase())
        )
      : iconKeys;

    return filtered
      .filter((iconName) => isLucideIcon(LucideIcons[iconName]))
      .slice(0, 100);
  }, [search]);

  return (
    <div className="flex flex-col h-full max-h-[70vh]">
      <div className="px-8 pt-6 pb-2">
        <div className="flex items-center rounded-xl px-4 py-3 border transition-all bg-gray-50 border-gray-200 focus-within:border-indigo-500 dark:bg-slate-950 dark:border-slate-800 dark:focus-within:border-indigo-500">
          <LucideIcons.Search size={18} className="opacity-50 mr-3" />
          <input
            type="text"
            placeholder="Search icons..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none w-full text-sm font-medium"
            autoFocus
          />
        </div>
      </div>

      <div className="p-8 grid grid-cols-6 sm:grid-cols-8 gap-3 overflow-y-auto min-h-[300px]">
        {filteredIcons.map((iconName) => {
          const iconCandidate = LucideIcons[iconName];
          if (!isLucideIcon(iconCandidate)) return null;

          const IconComponent = iconCandidate;

          return (
            <button
              key={iconName}
              onClick={() => {
                onSelect(iconName);
                onClose();
              }}
              className={`flex items-center justify-center p-3 rounded-xl transition-all border aspect-square ${
                selectedIcon === iconName
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg scale-110'
                  : 'bg-gray-50 border-gray-100 hover:bg-white hover:border-gray-200 hover:shadow-md dark:bg-slate-800 dark:border-slate-800 dark:hover:bg-slate-700 dark:hover:border-slate-600'
              }`}
              title={iconName}
              type="button"
            >
              <IconComponent size={24} />
            </button>
          );
        })}
      </div>

      <div className="px-8 py-3 border-t text-[10px] text-center opacity-50 border-gray-100 dark:border-slate-800">
        Showing top {filteredIcons.length} results
      </div>
    </div>
  );
}

