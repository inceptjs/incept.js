import Framework from './types/Framework';
//globally load the app instance
const inceptGlobal = global as unknown as { incept: Framework };
const app = inceptGlobal.incept || new Framework();
if (process.env.NODE_ENV !== 'production') {
  inceptGlobal.incept = app;
}
export default app;