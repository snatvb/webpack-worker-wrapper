/* @flow */
import Long from 'long'

export type PostMessage = {
  data: any,
  type: string,
}

type ReceiveMessage = {
  id: string,
  success: boolean,
  data: any,
}

type Options = {
  timeout?: number,
  logging?: boolean,
}

type PromiseElement = {|
  +resolve: Function,
  +reject: Function,
  +timeoutId: TimeoutID,
|}

type PromiseCollection = {
  [string]: PromiseElement
}

const wrapper = (WorkerToWrap: any, options: Options = {}) => {
  const worker = new WorkerToWrap()
  const opts: Options = Object.assign({
    timeout: 60000,
    logging: true,
  }, options)
  let currentId = Long.fromNumber(0, true)
  const promiseCollection: PromiseCollection = {}

  const timeout = (id: string) => () => {
    if (promiseCollection[id]) {
      opts.logging && console.log('timeout worker wrapper')
      delete promiseCollection[id]
    }
  }

  const postMessage = (message: PostMessage): Promise<any> => {
    return new Promise((resolve, reject) => {
      const id = currentId.toString()
      currentId = currentId.add(1)
      const timeoutId = setTimeout(timeout(id), opts.timeout)
      promiseCollection[id] = {
        resolve,
        reject,
        timeoutId,
      }
      worker.postMessage({
        data: message.data,
        type: message.type,
        id,
      })
    })
  }

  worker.onmessage = (event) => {
    const { id, data, success } = event.data
    const promise: ?PromiseElement = promiseCollection[id]
    if(!promise) {
      opts.logging && console.warn(`Can't find promise for(id: ${id})`, worker)
      return
    }

    clearTimeout(promise.timeoutId)
    delete promiseCollection[id]
    success ? promise.resolve(data) : promise.reject(data)
  }

  return {
    postMessage,
    getWorker: () => worker
  }
}

export default wrapper
