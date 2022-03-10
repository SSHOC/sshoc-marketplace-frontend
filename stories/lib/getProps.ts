import type { GetServerSidePropsResult, GetStaticPropsResult } from 'next'

export async function getProps<T>(
  response: GetServerSidePropsResult<T> | GetStaticPropsResult<T>,
): Promise<T> {
  if (!('props' in response)) {
    throw new Error(
      '`getStaticProps` returned ' +
        ('redirect' in response ? '307 Redirect' : '404 Not Found') +
        '.',
    )
  }

  return response.props
}
