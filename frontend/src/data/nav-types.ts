export type NavChildItem = {
  label: string;
  href: string;
  description?: string;
};

export type NavItem = {
  label: string;
  href: string;
  children?: NavChildItem[];
};
