export interface SelectDropdownProps {
  trigger: React.ReactNode;
  options: { value: string; label: string; flag?: string }[];
  onSelect: (value: string) => void;
  selected: string;
  align?: "left" | "right";
}
