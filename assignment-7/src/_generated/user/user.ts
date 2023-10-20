/**
 * Generated by orval v6.18.1 🍺
 * Do not edit manually.
 * Swagger API
 * This is a swagger for API.
 * OpenAPI spec version: 1.0
 */
import useSwr from 'swr'
import type { SWRConfiguration, Key } from 'swr'
import type {
  MeResponse,
  ErrorResponse,
  UserResponse,
  UpdateUserRequest,
  MessageResponse,
  UpdatePasswordRequest,
} from '../model'
import { customInstance } from '../../_libs/custom-instance'

// eslint-disable-next-line
  type SecondParameter<T extends (...args: any) => any> = T extends (
  config: unknown,
  args: infer P,
) => unknown
  ? P
  : never

/**
 * Retrieve my information
 * @summary Retrieve my information
 */
export const getMe = (options?: SecondParameter<typeof customInstance>) => {
  return customInstance<MeResponse>({ url: `/me`, method: 'get' }, options)
}

export const getGetMeKey = () => [`/me`] as const

export type GetMeQueryResult = NonNullable<Awaited<ReturnType<typeof getMe>>>
export type GetMeQueryError = ErrorResponse

/**
 * @summary Retrieve my information
 */
export const useGetMe = <TError = ErrorResponse>(options?: {
  swr?: SWRConfiguration<Awaited<ReturnType<typeof getMe>>, TError> & {
    swrKey?: Key
    enabled?: boolean
  }
  request?: SecondParameter<typeof customInstance>
}) => {
  const { swr: swrOptions, request: requestOptions } = options ?? {}

  const isEnabled = swrOptions?.enabled !== false
  const swrKey =
    swrOptions?.swrKey ?? (() => (isEnabled ? getGetMeKey() : null))
  const swrFn = () => getMe(requestOptions)

  const query = useSwr<Awaited<ReturnType<typeof swrFn>>, TError>(
    swrKey,
    swrFn,
    swrOptions,
  )

  return {
    swrKey,
    ...query,
  }
}

/**
 * Update user
 * @summary Update user
 */
export const updateUser = (
  updateUserRequest: UpdateUserRequest,
  options?: SecondParameter<typeof customInstance>,
) => {
  return customInstance<UserResponse>(
    {
      url: `/users`,
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      data: updateUserRequest,
    },
    options,
  )
}

/**
 * Update user's password
 * @summary Update user's password
 */
export const updatePassword = (
  updatePasswordRequest: UpdatePasswordRequest,
  options?: SecondParameter<typeof customInstance>,
) => {
  return customInstance<MessageResponse>(
    {
      url: `/users/password`,
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      data: updatePasswordRequest,
    },
    options,
  )
}
