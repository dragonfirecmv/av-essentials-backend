const nonNavigableTarget = Symbol();

export function safe(target: object | any, defaultValue?: any): any {
  // If the target was already wrapped, return the wrapped target
  if (target && (typeof target === 'object') && (target[nonNavigableTarget])) return target;

  // @ts-ignore
  const _this: any = this;
  if (typeof target === "function") return function () {
    return safe(target.apply(_this, arguments), defaultValue);
  };

  // wrap non object values which we can't futher navigate
  if (typeof target !== "object" || target === null) {
    target = target || defaultValue;
    target = { 
      [nonNavigableTarget]: { 
        target: target, 
        isResolved: !target || target === defaultValue 
      } 
    };
  }

  // Create a safe proxy for the target
  const proxy = new Proxy(target, {
    get: function (target, key) {

      // Resolve the actual value when the $ terminator key is used
      if (key === '$') {
        if (target[nonNavigableTarget]) return target[nonNavigableTarget].target;
        return target;
      }

      // We have already resolved to a non navigable value.  
      // Keep returning what we already resolved if there are more lookups
      if (target[nonNavigableTarget] && target[nonNavigableTarget].isResolved) 
        return safe(target[nonNavigableTarget].target, defaultValue);
      
      
      // When a property is requested, wrap it in a proxy
      return safe.call(target, target[key], defaultValue);
    },
    // @ts-ignore
    apply: function (target, thisArg, argumentsList) {
      // This can only be called on the proxy when there is an attempt to invoke a non function
      // function values are wrapped in a function outside of the proxy
      return safe(target[nonNavigableTarget].target, defaultValue);
    }
  });
  return proxy;
}
