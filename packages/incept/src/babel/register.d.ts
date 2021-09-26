declare module '@babel/register' {
  function register(config: Record<string, any>);
  export = register
}