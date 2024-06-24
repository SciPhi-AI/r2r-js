"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.feature = feature;
const posthog_js_1 = __importDefault(require("posthog-js"));
const posthogApiKey = "phc_OPBbibOIErCGc4NDLQsOrMuYFTKDmRwXX6qxnTr6zpU";
const posthogHost = "https://us.i.posthog.com";
function initializePostHog() {
    if (typeof window === "undefined") {
        return;
    }
    posthog_js_1.default.init(posthogApiKey, {
        api_host: posthogHost,
        autocapture: true,
    });
    if (process.env.R2R_JS_DISABLE_TELEMETRY === "true") {
        posthog_js_1.default.opt_out_capturing();
    }
    window.addEventListener("beforeunload", () => {
        posthog_js_1.default.capture("PageUnload");
    });
}
function feature(operationName) {
    return function (_target, _propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function (...args) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const result = yield originalMethod.apply(this, args);
                    posthog_js_1.default.capture("OperationComplete", { operation: operationName });
                    return result;
                }
                catch (error) {
                    posthog_js_1.default.capture("OperationError", {
                        operation: operationName,
                        errorMessage: error instanceof Error ? error.message : "Unknown error",
                    });
                    throw error;
                }
            });
        };
        return descriptor;
    };
}
initializePostHog();
