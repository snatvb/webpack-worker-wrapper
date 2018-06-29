declare module "webpack-worker-wrapper" {
  declare export type PostMessage = {
    data: any,
    type: string,
  };

  declare export type Options = {
    timeout?: number,
    logging?: boolean,
  };

  declare type Out = {
    postMessage: (message: PostMessage) => Promise<any>,
    getWorker: () => any,
  }
  declare export default function wrapper (worker: any, options?: Options): Out;
}