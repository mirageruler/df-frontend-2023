/**
 * Generated by orval v6.18.1 🍺
 * Do not edit manually.
 * Swagger API
 * This is a swagger for API.
 * OpenAPI spec version: 1.0
 */
import type { ErrorDetail } from './errorDetail'

export interface ErrorResponse {
  code: string
  error: string
  errors?: ErrorDetail[]
  traceId: string
}
