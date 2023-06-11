// Breadcrumbs Component
export type Crumb = { 
  href?: string, 
  label: string|JSX.Element, 
  icon?: string
};

export type CrumbProps = Crumb & { 
  last?: boolean
};

export type CrumbsProps = {
  crumbs: Crumb[], 
  className?: string,
  label?: string
};