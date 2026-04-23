import * as Icons from 'lucide-react';
import React from 'react';

export const ICON_LIST = [
  'User', 'Users', 'UserCheck', 'UserPlus', 'UsersRound',
  'Home', 'Building2', 'MapPin', 'Flag', 'Rocket',
  'Star', 'Award', 'BadgeCheck', 'Heart', 'Smile',
  'MessageSquare', 'Phone', 'Mail', 'Bell', 'Calendar',
  'CalendarCheck', 'CheckCircle2', 'Clock', 'History', 'Zap',
  'Briefcase', 'GraduationCap', 'Book', 'Library', 'School',
  'Shield', 'Key', 'Lock', 'Unlock', 'KeyRound',
  'Camera', 'Image', 'Video', 'Music', 'Mic',
  'Laptop', 'Smartphone', 'Tablet', 'Tv', 'Speaker',
  'ShoppingBag', 'ShoppingCart', 'CreditCard', 'Banknote', 'Coins',
  'Gift', 'PartyPopper', 'Cake', 'Coffee', 'Utensils',
  'Globe', 'Compass', 'Map', 'Navigation', 'Tent',
  'Plane', 'Train', 'Bus', 'Car', 'Bike',
  'Sun', 'Moon', 'Cloud', 'CloudRain', 'Wind',
  'Leaf', 'TreePine', 'Sprout', 'Flower2', 'Wind',
  'Search', 'Settings', 'Trash2', 'Edit2', 'Plus',
  'Filter', 'List', 'Menu', 'LayoutGrid', 'Table',
  'ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'ChevronRight',
  'Info', 'AlertCircle', 'AlertTriangle', 'HelpCircle', 'MoreHorizontal'
];

export const LucideIcon = ({ name, size = 20, className = "" }: { name: string, size?: number, className?: string }) => {
  const IconComponent = (Icons as any)[name];
  if (!IconComponent) return null;
  return <IconComponent size={size} className={className} />;
};
