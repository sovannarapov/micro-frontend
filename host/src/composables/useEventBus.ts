import mitt from 'mitt';
import { createHooks } from 'hookable';

const hooks = createHooks();
const emitter = mitt();

export const useHook = hooks.hook;
export const useCallHook = hooks.callHook;
export const useEmitEvent = emitter.emit;
export const useEmitListen = emitter.on;
