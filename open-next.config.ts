import type { OpenNextConfig } from '@opennextjs/cloudflare'

const config: OpenNextConfig = {
  default: {
    override: {
      wrapper: 'opennextjs-cloudflare',
      converter: 'opennextjs-cloudflare',
      incrementalCache: 'opennextjs-cloudflare',
      tagCache: 'opennextjs-cloudflare',
      queue: 'opennextjs-cloudflare',
    },
  },
}

export default config
