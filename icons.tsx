import * as Icons from 'lucide-react';
import React from 'react';

export const ICON_LIST = [
  'User', 'Users', 'UserCheck', 'UserPlus', 'UsersRound',
  'Home', 'Building2', 'Building', 'Warehouse', 'Landmark',
  'MapPin', 'Flag', 'Rocket', 'Map', 'Compass',
  'Star', 'Award', 'BadgeCheck', 'Heart', 'Smile',
  'MessageSquare', 'Phone', 'Mail', 'Bell', 'Calendar',
  'CalendarCheck', 'CheckCircle2', 'Clock', 'History', 'Zap',
  'Briefcase', 'GraduationCap', 'Book', 'Library', 'School',
  'Shield', 'Key', 'Lock', 'Unlock', 'KeyRound',
  'Camera', 'Image', 'Video', 'Music', 'Mic',
  'Laptop', 'Smartphone', 'Tablet', 'Tv', 'Speaker',
  'ShoppingBag', 'ShoppingCart', 'CreditCard', 'Banknote', 'Coins',
  'Gift', 'PartyPopper', 'Cake', 'Coffee', 'Utensils',
  'Globe', 'Navigation', 'Tent', 'Plane', 'Train',
  'Bus', 'Car', 'Bike', 'Truck', 'Anchor',
  'Sun', 'Moon', 'Cloud', 'CloudRain', 'Wind',
  'Leaf', 'TreePine', 'Sprout', 'Flower2', 'Wind',
  'Search', 'Settings', 'Trash2', 'Edit2', 'Plus',
  'Filter', 'List', 'Menu', 'LayoutGrid', 'Table',
  'ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'ChevronRight',
  'Info', 'AlertCircle', 'AlertTriangle', 'HelpCircle', 'MoreHorizontal',
  'Activity', 'Fingerprint', 'Stethoscope', 'HeartPulse', 'Thermometer',
  'Hammer', 'Wrench', 'Pickaxe', 'Scissors', 'PenTool',
  'Lightbulb', 'BookOpen', 'Check', 'X', 'Ban',
  'Hash', 'AtSign', 'Link', 'Dna', 'Atom',
  'Anchor', 'Angry', 'Annoyed', 'Aperture', 'Apple',
  'Archive', 'Armchair', 'ArrowBigDown', 'ArrowBigLeft', 'ArrowBigRight',
  'ArrowBigUp', 'Asterisk', 'Axe', 'Baby', 'Backpack',
  'BaggageClaim', 'Banana', 'Banknote', 'Barcode', 'Baseline',
  'Bath', 'Battery', 'BatteryCharging', 'BatteryFull', 'BatteryLow',
  'BatteryMedium', 'BatteryWarning', 'Beaker', 'Bean', 'BeanOff'
];

export const LucideIcon = ({ name, size = 20, className = "" }: { name: string, size?: number, className?: string }) => {
  const IconComponent = (Icons as any)[name];
  if (!IconComponent) return null;
  return <IconComponent size={size} className={className} />;
};
