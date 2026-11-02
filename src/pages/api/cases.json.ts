import type { APIRoute } from 'astro'
import { DESIGN_CASES } from '../../data/cases'

export const prerender = true

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify(DESIGN_CASES, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  })
}
