import { rest } from 'msw'

import type {
  GetCurrentUser,
  OAuthRegistration,
  SignInUser,
  SignUpUser,
  ValidateOAuthToken,
} from '@/data/sshoc/api/auth'
import { createUrl } from '@/data/sshoc/lib/client'
import { db } from '@/data/sshoc/mocks/data/db'

export const handlers = [
  rest.post<SignInUser.Body, never, undefined>(
    String(createUrl({ pathname: '/api/auth/sign-in' })),
    (request, response, context) => {
      const secrets = db.userSecret.getByUsername(request.body.username)

      if (secrets == null || request.body.password !== secrets.password) {
        return response(
          context.status(401),
          // context.json({
          //   timestamp: new Date('2020-01-01').toISOString(),
          //   status: 401,
          //   error: 'Unauthorized',
          //   message: 'Unauthorized',
          //   path: '/api/auth/sign-in',
          // }),
        )
      }

      return response(context.set('authorization', secrets.token.access))
    },
  ),
  rest.put<ValidateOAuthToken.Body, never, OAuthRegistration | undefined>(
    String(createUrl({ pathname: '/api/oauth/token' })),
    (request, response, context) => {
      const secrets = db.userSecret.getByIdToken(request.body.token)

      if (secrets == null) {
        return response(
          context.status(400),
          // context.json({
          //   timestamp: new Date('2020-01-01').toISOString(),
          //   status: 400,
          //   error: 'Invalid token!',
          // }),
        )
      }

      if (request.body.registration === true) {
        return response(
          context.set('authorization', secrets.token.registration /** Restricted access token. */),
          context.json({
            id: secrets.user.id,
            displayName: secrets.user.displayName,
            email: secrets.user.email,
          }),
        )
      }

      return response(context.set('authorization', secrets.token.access))
    },
  ),
  rest.put<SignUpUser.Body, never, Omit<SignUpUser.Response, 'token'>>(
    String(createUrl({ pathname: '/api/oauth/sign-up' })),
    (request, response, context) => {
      /** Access token restricted until successful sign up. */
      const registrationToken = request.headers.get('authorization')

      if (registrationToken == null) {
        return response(
          context.status(403),
          // context.json({
          //   timestamp: new Date('2020-01-01').toISOString(),
          //   status: 403,
          //   error: 'Forbidden',
          //   message: 'Access Denied',
          //   path: '/api/oauth/sign-up',
          // }),
        )
      }

      const secrets = db.userSecret.getByRegistrationToken(registrationToken)

      if (secrets == null) {
        return response(
          context.status(403),
          // context.json({
          //   timestamp: new Date('2020-01-01').toISOString(),
          //   status: 403,
          //   error: 'Forbidden',
          //   message: 'Access Denied',
          //   path: '/api/oauth/sign-up',
          // }),
        )
      }

      return response(
        context.set('authorization', secrets.token.access),
        context.json(secrets.user),
      )
    },
  ),
  rest.get<never, never, GetCurrentUser.Response>(
    String(createUrl({ pathname: '/api/auth/me' })),
    (request, response, context) => {
      const accessToken = request.headers.get('authorization')

      if (accessToken == null) {
        return response(
          context.status(403),
          // context.json({
          //   timestamp: new Date('2020-01-01').toISOString(),
          //   status: 403,
          //   error: 'Forbidden',
          //   message: 'Access Denied',
          //   path: '/api/auth/me',
          // }),
        )
      }

      const secrets = db.userSecret.getByAccessToken(accessToken)

      if (secrets == null) {
        return response(
          context.status(403),
          // context.json({
          //   timestamp: new Date('2020-01-01').toISOString(),
          //   status: 403,
          //   error: 'Forbidden',
          //   message: 'Access Denied',
          //   path: '/api/auth/me',
          // }),
        )
      }

      return response(context.json(secrets.user))
    },
  ),
]
