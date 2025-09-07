/* eslint-disable @typescript-eslint/no-explicit-any */
declare module "process" {
  const process: any;
  export default process;
}

declare module "process/browser" {
  const process: any;
  export default process;
}

declare module "buffer" {
  export const Buffer: any;
}
