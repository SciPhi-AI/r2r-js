import posthog from "posthog-js";

const posthogApiKey = "phc_OPBbibOIErCGc4NDLQsOrMuYFTKDmRwXX6qxnTr6zpU";
const posthogHost = "https://us.i.posthog.com";

function initializePostHog() {
  if (typeof window === "undefined") {
    return;
  }

  posthog.init(posthogApiKey, {
    api_host: posthogHost,
    autocapture: true,
  });

  if (process.env.R2R_JS_DISABLE_TELEMETRY === "true") {
    posthog.opt_out_capturing();
  }

  window.addEventListener("beforeunload", () => {
    posthog.capture("PageUnload");
  });
}

type AsyncFunction = (...args: any[]) => Promise<any>;

export function feature(operationName: string) {
  return function (
    _target: any,
    _propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<AsyncFunction>,
  ): TypedPropertyDescriptor<AsyncFunction> {
    const originalMethod = descriptor.value!;

    descriptor.value = async function (
      this: any,
      ...args: any[]
    ): Promise<any> {
      try {
        const result = await originalMethod.apply(this, args);
        posthog.capture("OperationComplete", { operation: operationName });
        return result;
      } catch (error: unknown) {
        posthog.capture("OperationError", {
          operation: operationName,
          errorMessage:
            error instanceof Error ? error.message : "Unknown error",
        });
        throw error;
      }
    };

    return descriptor;
  };
}

initializePostHog();
