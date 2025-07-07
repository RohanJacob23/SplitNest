import type { AppType } from '@api/index'
import { hc } from 'hono/client'

export const client = hc<AppType>('/', { init: { credentials: 'include' } }).api
