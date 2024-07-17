import { createPagesFunctionHandler } from '@cloudflare/next-on-pages'

// @ts-ignore
const handler = createPagesFunctionHandler({
  build: require('./.vercel/output/functions/[[path]].func'),
})

export const onRequest = handler
