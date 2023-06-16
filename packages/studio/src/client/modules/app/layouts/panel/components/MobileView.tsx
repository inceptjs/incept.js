import type { ReactNode } from 'react';

const MobileView: React.FC<{ 
  opened?: boolean, 
  children?: ReactNode|ReactNode[],
  view: (el: HTMLBaseElement) => void
}> = ({ 
  view,
  children = [],
  opened = false
}) => {
  if (!Array.isArray(children)) children = [ children ];
  return (
    <aside ref={view} className={`flex items-start justify-start flex-nowrap overflow-hidden w-full md:w-[550px] duration-200 absolute top-0 bottom-0 z-50 bg-b3 border-l border-b0 ${opened? 'right-0': 'right-[-550px]' }`}>
      {Array.from(children).map((child, i) => (
        <div key={i} className="flex-grow-0 flex-shrink-0 flex flex-col basis-full w-full h-full relative">
          {child}
        </div>
      ))}
    </aside>
  );
};

export default MobileView;