import { createPagesFunctionHandler } from '@cloudflare/next-on-pages'

const handler = createPagesFunctionHandler({
  build: require('./build'),
})

export function onRequest(context) {
  return handler(context)
}
