type WrappedOnceHandler<F extends (...args: any[]) => void> = F & {
  __immerserOriginalHandler?: F;
};

export function wrapOnceHandler<F extends(...args: any[]) => void>(
  original: F,
  wrapper: (...args: Parameters<F>) => void,
): F {
  const wrapped = wrapper as WrappedOnceHandler<F>;
  wrapped.__immerserOriginalHandler = original;
  return wrapped;
}

export function getOriginalHandler<F extends(...args: any[]) => void>(handler: F): F | undefined {
  return (handler as WrappedOnceHandler<F>).__immerserOriginalHandler;
}
