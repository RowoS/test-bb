import { 
  ClipboardList, 
  BookOpen, 
  Sprout, 
  Bell, 
  Settings 
} from 'lucide-react';

import { MenuItemConfig } from '@/shared/types';

export const PrimarySidebarItems: MenuItemConfig[] = [
  { id: 'Tasks', label: 'Tasks', icon: <ClipboardList size={20} />, href: "/tasks" },
  { id: 'Plant List', label: 'Plant List', icon: <Sprout size={20} />, href: "/plant-list" },
  { id: 'Journal', label: 'Journal', icon: <BookOpen size={20} />, href: "/journal" },
];

export const SecondarySidebarItems: MenuItemConfig[] = [
  { id: 'Notifications', label: 'Notifications', icon: <Bell size={20} />, href: "/notifications" },
  { id: 'Settings', label: 'Settings', icon: <Settings size={20} />, href: "settings" },
];