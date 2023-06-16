export type AnimateConfig = {
  start: number, 
  end: number, 
  duration: number,
  increment?: number,
  update: (value: number) => void,
  complete?: () => void
}

const easeInOutQuad = (t: number, b: number, c: number, d: number) => {
  t /= d / 2;
  if (t < 1) return c / 2 * t * t + b;
  t--;
  return -c /2 * (t * (t - 2) - 1) + b;
}

const animate = (config: AnimateConfig) => {
  const {
    start, 
    end, 
    duration,
    increment = 20,
    update,
    complete
  } = config;
  const distance = end - start;
  let currentTime = 0;
  const animate = () => {
    currentTime += increment;
    update(easeInOutQuad(
      currentTime, 
      start, 
      distance, 
      duration
    ));
    if (currentTime < duration) {
      setTimeout(animate, increment);
    } else {
      complete && complete();
    }
  };
  animate();
};

export default animate;