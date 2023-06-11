import type { Crumb, CrumbProps, CrumbsProps } from './types';

import React from 'react';

const Item: React.FC<CrumbProps> = ({ href, label, icon, last }) => {
  const item = href
    ? <a href={href} className="inline-flex items-center text-t2">{label}</a>
    : <span className="inline-flex items-center font-semibold text-t-muted">{label}</span>

  return (
    <>
      {icon && <i className={`fas fa-fw fa-${icon} inline-block mr-1 text-t-muted`}></i>}
      {item}
      {!last && <i className="fas fa-fw fa-chevron-right mx-1 text-t0"></i>}
    </>
  )
}

const Crumbs: React.FC<CrumbsProps> = ({ crumbs, className, label = 'Admin' }) => {
  const trail: Crumb[] = [{
    href: '/',
    icon: 'home',
    label: label
  }, ...crumbs];

  const classNames = [ 'flex items-center p-2 whitespace-nowrap overflow-x-auto' ];

  if (className) {
    classNames.push(className);
  }

  return (
    <nav className={classNames.join(' ')}>
      {trail.map((item, key) => (
        <Item 
          key={key} 
          href={item.href} 
          label={item.label} 
          icon={item.icon} 
          last={key === (trail.length - 1)}
        />
      ))}
    </nav>
  );
}

export default Crumbs;

export type { Crumb, CrumbProps, CrumbsProps };