if (global) {
  if (typeof global.window === 'undefined') {
    global.window = {} as any
  }

  // Quick pollyfill for: This browser doesn't support 
  // requestAnimationFrame. Make sure that you load a polyfill 
  // in older browsers. https://reactjs.org/link/react-polyfills
  // this happens because of `react-redux` but apparently im the
  // only one experience this...
  global.window.cancelAnimationFrame = () => {};
  global.window.requestAnimationFrame = () => { return 0; };
}