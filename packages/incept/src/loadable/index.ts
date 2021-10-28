import React, { 
  Attributes, 
  ComponentType, 
  ReactNode, 
  ForwardRefExoticComponent, 
  RefAttributes 
} from 'react';
import * as ReactIs from 'react-is';
import hoistNonReactStatics from 'hoist-non-react-statics';
import Exception from './Exception';
//@ts-ignore
import { __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED } from '@loadable/component';
//@ts-ignore
const { Context } = __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;

export enum STATUS {
  PENDING = 'PENDING',
  RESOLVED = 'RESOLVED',
  REJECTED = 'REJECTED'
};

type InnerLoadableProps = Attributes & {
  __chunkExtractor?: any;
  fallback?: Function;
  forwardedRef?: Function;
};

type InnerLoadableStates = {
  result: any;
  error: string|Exception|Error|null;
  loading: boolean;
  selfProps: Record<string, any>|null;
  cacheKey: string;
};

type Resolver = {
  requireAsync: Function;
  resolve: Function;
  chunkName: Function;
  requireSync?: Function;
  requireASync?: Function;
  isReady?: Function;
};

type CreateLoadableOptions = {
  defaultResolveComponent: Function;
  render: Function;
  onLoad?: Function;
};

type ForwardRefWithOptions = ForwardRefExoticComponent<RefAttributes<unknown>> & {
  displayName?: string;
  preload?: Function;
  load?: Function;
  loadProps?: Function;
};

type LoadableShared = {
  initialChunks: Record<string, any>;
};

type LoadableReadyOptions = {
  namespace?: string;
  chunkLoadingGlobal?: string;
};

const BROWSER = typeof window !== 'undefined';
const LOADABLE_SHARED: LoadableShared = { initialChunks: {} };

const LOADABLE_REQUIRED_CHUNKS_KEY = '__LOADABLE_REQUIRED_CHUNKS__';
const identity = (v: any) => v;

function getRequiredChunkKey(namespace: string) {
  return `${namespace}${LOADABLE_REQUIRED_CHUNKS_KEY}`
}

const withChunkExtractor = (Component: ComponentType) => {
  var LoadableWithChunkExtractor = function LoadableWithChunkExtractor(props: Attributes) {
    return React.createElement(Context.Consumer, null, function (extractor: any) {
      return React.createElement(Component, Object.assign({
        __chunkExtractor: extractor
      }, props));
    });
  };

  if (Component.displayName) {
    //@ts-ignore
    LoadableWithChunkExtractor.displayName = Component.displayName + "WithChunkExtractor";
  }

  return LoadableWithChunkExtractor;
};

function resolveConstructor(resolver: Resolver|Function): Resolver {
  if (typeof resolver === 'function') {
    return {
      requireAsync: resolver,
      resolve() {
        return undefined;
      },
      chunkName() {
        return undefined;
      },
    };
  }

  return resolver;
}

export function createLoadable(options: CreateLoadableOptions) {
  const { defaultResolveComponent = identity, render, onLoad } = options;
  function loadable(
    loadableConstructor: Resolver|Function, 
    options: Record<string, any> = {}
  ) {
    //first define the wrapper component
    class InnerLoadable extends React.Component {
      static getDerivedStateFromProps(
        props: Record<string, any>, 
        state: Record<string, any>
      ) {
        const cacheKey = getCacheKey(props)
        return {
          ...state,
          cacheKey,
          // change of a key triggers loading state automatically
          loading: state.loading || state.cacheKey !== cacheKey,
        };
      }

      /**
       * Whether or not component is mounted
       */
      protected mounted: boolean = false;

      /**
       * Needed to declare state for type check
       */
      public state: InnerLoadableStates;

      /**
       * Set states and props
       */
      constructor(props: Record<string, any>) {
        super(props);

        this.state = {
          result: null,
          error: null,
          loading: true,
          selfProps: null,
          cacheKey: getCacheKey(props),
        };

        Exception.require(!props.__chunkExtractor 
            || typeof resolver.requireSync === 'function',
          'SSR requires `@loadable/babel-plugin`, please install it'
        );

        // Server-side
        if (props.__chunkExtractor) {
          // This module has been marked with no SSR
          if (options.ssr === false) {
            return;
          }
          
          // We run load function, we assume that it won't fail and that it
          // triggers a synchronous loading of the module
          resolver.requireAsync(props).catch(() => null);

          // So we can require now the module synchronously
          this.loadSync();

          props.__chunkExtractor.addChunk(resolver.chunkName(props));
          return;
        }

        // Client-side with `isReady` method present (SSR probably)
        // If module is already loaded, we use a synchronous loading
        // Only perform this synchronous loading if the component has not
        // been marked with no SSR, else we risk hydration mismatches
        const isServerAndHasReadyFn = options.ssr !== false && (
          // is ready - was loaded in this session
          (typeof resolver.isReady === 'function' && resolver.isReady(props)) 
          // is ready - was loaded during SSR process
          || (
            resolver.chunkName 
            && LOADABLE_SHARED.initialChunks[resolver.chunkName(props)]
          )
        );

        if (isServerAndHasReadyFn) {
          this.loadSync();
        }
      }

      /**
       * This is what happens when the component is mounted
       */
      componentDidMount() {
        this.mounted = true;

        // retrieve loading promise from a global cache
        const cachedPromise = this.getCache();

        // if promise exists, but rejected - clear cache
        if (cachedPromise && cachedPromise.status === STATUS.REJECTED) {
          this.setCache()
        }

        // component might be resolved synchronously in the constructor
        if (this.state.loading) {
          this.loadAsync()
        }
      }

      /**
       * This is what happens when the component updated because of 
       * a state change
       */
      componentDidUpdate(
        prevProps: Attributes, 
        prevState: InnerLoadableStates
      ) {
        // Component has to be reloaded on cacheKey change
        if (prevState.cacheKey !== this.state.cacheKey) {
          this.loadAsync()
        }
      }

      /**
       * This is what happens when the component
       */
      componentWillUnmount() {
        this.mounted = false
      }

      /**
       * Only set's state if mounted
       */
      safeSetState(nextState: any, callback?: () => void) {
        if (this.mounted) {
          this.setState(nextState, callback);
        }
      }

      /**
       * Returns a cache key for the current props
       */
      getCacheKey(): string {
        return getCacheKey(this.props)
      }

      /**
       * Sccess the persistent cache
       */
      getCache() {
        return cache[this.getCacheKey()]
      }

      /**
       * sets the cache value. If called without value sets it as undefined
       */
      setCache(value = undefined) {
        cache[this.getCacheKey()] = value
      }

      /**
       * Separately triggers the on load which only triggers on 
       * the client side...
       */
      triggerOnLoad() {
        if (onLoad) {
          setTimeout(() => {
            onLoad(this.state.result, this.props)
          })
        }
      }

      /**
       * Custom: You can now lazy add `loadProps()` to a loadable 
       * component
       */
      loadProps(Component: ComponentType) {
        //if there are props already.
        if (this.state.selfProps) {
          return;
        }
        //if there are load props in the main loadable component
        if (typeof Loadable.loadProps === 'function') {
          //call the custom load props
          const props = Loadable.loadProps(Component, this.props);
          //if it returned a promise
          if (typeof props?.then === 'function') {
            //then resolve the promise
            props.then((props: Attributes) => {
              //if an object was returned
              if (props?.constructor === Object) {
                //update the self props state
                if (this.mounted) {
                  this.setState({...this.state, selfProps: props});
                } else {
                  this.state.selfProps = props;
                }
                return;
              }
              //if no object was returned, set the self props 
              // state as an empty object
              if (this.mounted) {
                this.setState({...this.state, selfProps: {}});
              } else {
                this.state.selfProps = {};
              }
            });
            return;
          }
          //it's not a promise, if the props returned is an object
          if (props?.constructor === Object) {
            //set the self props state
            if (this.mounted) {
              this.setState({...this.state, selfProps: props});
            } else {
              this.state.selfProps = props;
            }
          } 
        }
        //if no object was returned, set the self props 
        // state as an empty object
        if (this.state.selfProps?.constructor !== Object) {
          if (this.mounted) {
            this.setState({...this.state, selfProps: {}});
          } else {
            this.state.selfProps = {};
          }
        }
      }

      /**
       * Synchronously loads component
       * target module is expected to already exists in the module cache
       * or be capable to resolve synchronously (webpack target=node)
       */
      loadSync() {
        // load sync is expecting component to be in the "loading" state already
        // sounds weird, but loading=true is the initial state of InnerLoadable
        if (!this.state.loading) return

        try {
          //@ts-ignore Object is possibly 'undefined'.
          const loadedModule = resolver.requireSync(this.props);
          const result = resolve(loadedModule, this.props, Loadable);
          this.state.result = result;
          this.state.loading = false;
          this.loadProps(result);
        } catch (error) {
          console.error(
            'loadable-components: failed to synchronously load component, which expected to be available',
            {
              fileName: resolver.resolve(this.props),
              chunkName: resolver.chunkName(this.props),
              //@ts-ignore Object is of type 'unknown'.
              error: error ? error.message : error,
            },
          )
          this.state.error = error as Error
        }
      }

      /**
       * Asynchronously loads a component.
       */
      loadAsync() {
        const promise = this.resolveAsync()

        promise
          .then((loadedModule: any) => {
            const result = resolve(loadedModule, this.props, Loadable);
            this.loadProps(result);
            this.safeSetState(
              { result, loading: false, },
              () => this.triggerOnLoad(),
            );
          })
          .catch((error: Error) => this.safeSetState({ error, loading: false }))

        return promise
      }

      /**
       * Asynchronously resolves(not loads) a component.
       * Note - this function does not change the state
       */
      resolveAsync() {
        const { 
          __chunkExtractor, 
          forwardedRef, 
          ...props 
        } = this.props as InnerLoadableProps;

        let promise = this.getCache()

        if (!promise) {
          promise = resolver.requireAsync(props);
          promise.status = STATUS.PENDING;

          this.setCache(promise)

          promise.then(
            () => {
              promise.status = STATUS.RESOLVED;
            },
            (error: Error) => {
              console.error(
                'loadable-components: failed to asynchronously load component',
                {
                  fileName: resolver.resolve(this.props),
                  chunkName: resolver.chunkName(this.props),
                  error: error ? error.message : error,
                },
              );
              promise.status = STATUS.REJECTED;
            },
          )
        }

        return promise
      }

      render() {
        const {
          forwardedRef,
          fallback: propFallback,
          __chunkExtractor,
          ...props
        } = this.props as InnerLoadableProps;
        const { error, loading, result, selfProps } = this.state;

        if (options.suspense) {
          const cachedPromise = this.getCache() || this.loadAsync();
          if (cachedPromise.status === STATUS.PENDING) {
            throw this.loadAsync();
          }
        }

        if (error) {
          throw error;
        }

        const fallback = propFallback || options.fallback || null;

        if (loading) {
          return fallback
        }

        return render({
          fallback,
          result,
          options,
          props: { ...props, ...selfProps, ref: forwardedRef },
        })
      }
    }

    /**
     * Cachekey represents the component to be loaded
     * if key changes - component has to be reloaded
     */
    function getCacheKey(props: Record<string, any>) {
      if (options.cacheKey) {
        return options.cacheKey(props);
      }
      if (resolver.resolve) {
        return resolver.resolve(props);
      }
      return 'static';
    }

    /**
     * Resolves loaded `module` to a specific `Component`
     */
    function resolve(
      module: any, 
      props: Readonly<{}> & Readonly<{ children?: ReactNode; }>, 
      Loadable: ComponentType<any>
    ) {
      const Component = options.resolveComponent
        ? options.resolveComponent(module, props)
        : defaultResolveComponent(module);

      if (options.resolveComponent && !ReactIs.isValidElementType(Component)) {
        throw Exception.for(
          `resolveComponent returned something that is not a React component!`,
        );
      }
      hoistNonReactStatics(Loadable, Component, {
        preload: true,
      });
      return Component;
    }

    //make a resolver
    const resolver = resolveConstructor(loadableConstructor);
    //make a default cache
    const cache: Record<string, any> = {};
    //wrap the component wrapper with chunk extractor
    const EnhancedInnerLoadable = withChunkExtractor(InnerLoadable)
    //wrap it again... with a forward ref
    const Loadable: ForwardRefWithOptions = React.forwardRef((props, ref) => (
      React.createElement(
        EnhancedInnerLoadable, 
        { forwardedRef: ref, ...props }
      )
    ));

    //make a default display name
    Loadable.displayName = 'Loadable';
    // In future, preload could use `<link rel="preload">`
    Loadable.preload = (props: Attributes) => {
      resolver.requireAsync(props)
    };

    Loadable.load = (props: Attributes) => resolver.requireAsync(props);

    return Loadable
  }

  function lazy(
    resolver: Function | Resolver, 
    options: Record<string, any> = {}
  ) {
    return loadable(resolver, { ...options, suspense: true })
  }

  return { loadable, lazy }
}

function defaultResolveComponent(loadedModule: any) {
  // eslint-disable-next-line no-underscore-dangle
  return loadedModule.__esModule
    ? loadedModule.default
    : loadedModule.default || loadedModule
}

export const { loadable, lazy } = createLoadable({
  defaultResolveComponent,
  render({ result: Component, props }: any) {
    return React.createElement(Component, {...props});
  },
});

export function loadableReady(
  done = () => {},
  options: LoadableReadyOptions = {},
): Promise<void> {
  const { 
    namespace = '', 
    chunkLoadingGlobal = '__LOADABLE_LOADED_CHUNKS__' 
  } = options;
  if (!BROWSER) {
    console.warn(
      'loadable: `loadableReady()` must be called in browser only'
    );
    done()
    return Promise.resolve()
  }

  let requiredChunks: Record<string, any>|null = null;
  if (BROWSER) {
    const id = getRequiredChunkKey(namespace)
    const dataElement = document.getElementById(id) as HTMLElement;
    if (typeof dataElement.textContent === 'string') {
      requiredChunks = JSON.parse(dataElement.textContent);

      const extElement = document.getElementById(`${id}_ext`) as HTMLElement;
      if (typeof extElement.textContent === 'string') {
        const { namedChunks } = JSON.parse(extElement.textContent);
        namedChunks.forEach((chunkName: string) => {
          LOADABLE_SHARED.initialChunks[chunkName] = true
        })
      } else {
        // version mismatch
        throw new Error(
          'loadable-component: @loadable/server does not match @loadable/component',
        )
      }
    }
  }

  if (!requiredChunks) {
    console.warn(
      'loadable: `loadableReady()` requires state, please use '
      + '`getScriptTags` or `getScriptElements` server-side'
    );
    done()
    return Promise.resolve()
  }

  let resolved = false

  return new Promise(resolve => {
    //@ts-ignore Element implicitly has an 'any' type because index 
    //expression is not of type 'number'.
    //Not sure how to fix this
    window[chunkLoadingGlobal] = window[chunkLoadingGlobal] || [];
    //@ts-ignore Element implicitly has an 'any' type because index 
    //expression is not of type 'number'.
    //Not sure how to fix this
    const loadedChunks = window[chunkLoadingGlobal]
    const originalPush = loadedChunks.push.bind(loadedChunks)

    function checkReadyState() {
      if (
        //@ts-ignore Object is possibly 'null'.
        // But it's not possible because if the conditional above
        requiredChunks.every(chunk =>
          //@ts-ignore
          loadedChunks.some(([chunks]) => chunks.indexOf(chunk) > -1)
        )
      ) {
        if (!resolved) {
          resolved = true;
          //@ts-ignore Expected 1 arguments, but got 0.
          resolve();
        }
      }
    }

    loadedChunks.push = (...args: any) => {
      originalPush(...args)
      checkReadyState()
    }

    checkReadyState()
  }).then(done)
}
