import React, { ReactNode } from 'react'

type Props = { 
  app: string, 
  props: { [key: string]: any }, 
  build: string|null, 
  children: ReactNode[]
}

export default function HTMLBody(bodyProps: Props) {
  const { app, props, build, children } = bodyProps;
  //shallow clone
  const clones = Array.from(children);
  if (typeof build === 'string') {
    //make build the last
    clones.push(React.createElement('script', {
      type: 'text/javascript',
      src: build
    }));
  }

  return React.createElement('body', props, 
    React.createElement('div', {
      id: '__incept_root',
      dangerouslySetInnerHTML: { __html: app }
    }),
    ...clones
  );
}