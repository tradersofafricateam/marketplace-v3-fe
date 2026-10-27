export interface SelectDropdownProps {
  trigger: React.ReactNode;
  options: { value: string; label: string; flag?: string }[];
  onSelect: (value: string) => void;
  selected: string;
  align?: "left" | "right";
  side?: "top" | "bottom";
}

export interface SliderType {
  id: string;
  href: string;
  bgColor: string;
  emoji: string;
  badge?: string;
  badgeColor?: string;
  title: string;
  subtitle: string;
}
