import { Tabs } from 'antd';
import { cn } from '@/lib/utils';

export interface FilterTabItem {
  key: string;
  label: React.ReactNode;
}

export interface FilterTabsProps {
  items: FilterTabItem[];
  activeKey: string;
  onChange: (key: string) => void;
  className?: string;
}

export function FilterTabs({ items, activeKey, onChange, className }: FilterTabsProps) {
  return (
    <Tabs
      activeKey={activeKey}
      onChange={onChange}
      className={cn('filter-tabs', className)}
      items={items.map((item) => ({
        key: item.key,
        label: item.label,
      }))}
    />
  );
}
