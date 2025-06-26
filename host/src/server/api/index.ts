import { createApp, createRouter, useBase, sendError, createError } from 'h3';

const app = createApp({
  debug: false,
  onError: (error, event) => {
    sendError(event, error);
  },
});
