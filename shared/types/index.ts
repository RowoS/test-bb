import { Button } from "@/shared/ui/button";
import { ReactNode } from "react";


export interface LoginFormProps extends React.ComponentPropsWithoutRef<"div"> {}

export interface CreateAccountFormProps extends React.ComponentPropsWithoutRef<"div"> {}

export interface SidebarHeaderProps {
  isOpen: boolean;
}

export interface SidebarToggleProps {
  isLocked: boolean;
  onToggle: () => void;
}

export interface SidebarItemProps {
  icon: ReactNode;
  label: string;
  isActive?: boolean;
  isOpen: boolean;
  onClick?: () => void;
}

export interface MenuItemConfig {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
}

export interface SidebarProfileProps {
  name: string;
  avatarUrl: string;
  isOpen: boolean;
}

export interface ActionButtonProps extends React.ComponentProps<typeof Button> {
  children: React.ReactNode;
}


