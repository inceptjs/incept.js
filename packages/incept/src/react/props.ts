import { ComponentType } from 'react';
import { RouteProps } from 'react-router-dom';
import { Request, Response } from '@inceptjs/framework';

type ComponentWithProps = ComponentType & { 
  getInitialProps?: Function;
  getServerProps?: Function;
  getStaticProps?: Function;
};

async function loadServerProps(
  Component: ComponentWithProps, 
  routeProps: RouteProps
) {
  if (typeof Component.getInitialProps !== 'function'
    && typeof Component.getServerProps !== 'function'
  ) {
    return;
  }

  //make a request
  const request = new Request(routeProps?.location?.pathname || null);
  //@ts-ignore Property 'match' does not exist on type 
  //'RouteProps<string, { [x: string]: string | undefined; }>'
  //see: https://reactrouter.com/web/api/Route/route-props
  request.assign(routeProps.match.params);
  //make a response
  const response = new Response;
  let props = null;

  //try `getInitialProps`
  if(typeof Component.getInitialProps === 'function') {
    const initialProps = await Component.getInitialProps(
      request, 
      response
    );

    if (initialProps?.constructor === Object) {
      props = initialProps;
    }
  }
  //try `getServerProps`
  if(typeof Component.getServerProps === 'function') {
    const serverProps = await Component.getServerProps(
      request, 
      response
    );

    if (serverProps?.constructor === Object) {
      if (!props) {
        props = serverProps;
      } else {
        Object.assign(props, serverProps);
      }
    }
  }

  return props;
}

async function loadStaticProps(
  Component: ComponentWithProps, 
  routeProps: RouteProps
) {
  if (typeof Component.getInitialProps !== 'function'
    && typeof Component.getStaticProps !== 'function'
  ) {
    return;
  }

  //make a request
  const request = new Request(window.location.href);
  //@ts-ignore Property 'match' does not exist on type 
  //'RouteProps<string, { [x: string]: string | undefined; }>'
  //see: https://reactrouter.com/web/api/Route/route-props
  request.assign(routeProps.match.params);
  //make a response
  const response = new Response;
  let props = null;

  //try `getInitialProps`
  if(typeof Component.getInitialProps === 'function') {
    const initialProps = await Component.getInitialProps(
      request, 
      response
    );

    if (initialProps?.constructor === Object) {
      props = initialProps;
    }
  }
  //try `getStaticProps`
  if(typeof Component.getStaticProps === 'function') {
    const staticProps = await Component.getStaticProps(
      request, 
      response
    );

    if (staticProps?.constructor === Object) {
      if (!props) {
        props = staticProps;
      } else {
        Object.assign(props, staticProps);
      }
    }
  }
  
  return props;
}

export default function loadProps(routeProps: RouteProps) {
  return async (Component: ComponentWithProps) => {
    if (typeof window !== 'undefined') {
      return await loadStaticProps(Component, routeProps);
    }

    return await loadServerProps(Component, routeProps);
  }
}