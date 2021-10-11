import { vfs } from './VirtualFS';

export default class VirtualFSPlugin {
  /**
   * Source
   */
  public source: string;

  /**
   * Target
   */
  public target: string;

  /**
   * Sets the source and the target
   */
	constructor(source: string = 'resolve', target: string = 'vfsResolve') {
		this.source = source;
		this.target = target;
	}

  /**
   * Resolves
   */
	apply(resolver: any) {
		const target = resolver.ensureHook(this.target);
		resolver
			.getHook(this.source)
			.tapAsync('VirtualFSPlugin', (
        request: Record<string, any>, 
        resolveContext: Record<string, any>, 
        callback: Function
      ) => {
        if (!request.request) {
          return callback();
        }

        const pathname = vfs.resolvePath(request.request as string);

        if (!pathname) {
          return callback();
        }

        const results = { ...request, request: pathname };
        const descriptor = `using VirtualFS file: ${results.request}`;
				// Any logic you need to create a new `request` can go here
				resolver.doResolve(target, request, descriptor, resolveContext, callback);
			});
	}
}