export type NavChildItem = {
  label: string;
  href: string;
  description?: string;
};

export type NavItem = {
  label: string;
  href: string;
  children?: NavChildItem[];
  /** Small note beside the label, e.g. for sections not launched yet. */
  badge?: string;
};
