import { logger } from './logger';

const sleep = (duration: number) =>
  new Promise((res) => setTimeout(res, duration));

/**
 * Retries a function when failed
 * @param {Promise} fn Method to retry
 * @param {Mixed} args Arguments for method
 * @param {Number} retries Max number of of retries
 * @param {Number} delayMs Delay in miliseconds before each retry
 */

export const retryFnOnFailure = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fn: any,
  args: unknown,
  retries: number = 5,
  delayMs: number = 2000,
) =>
  fn(args).catch(async (err: Readonly<Error>) => {
    if (retries > 1) {
      logger.debug('retryFnOnFailure', {
        fn,
        retries: retries - 1,
        delayMs,
        err,
      });
      await sleep(delayMs);
      return retryFnOnFailure(fn, args, retries - 1, delayMs);
    }
    logger.error('retryFnOnFailureErr', { fn, delayMs, err });
    throw err;
  });
