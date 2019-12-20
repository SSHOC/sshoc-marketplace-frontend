import css from '@styled-system/css'
import React from 'react'
import 'styled-components/macro'
import SearchBar from '../../components/SearchBar/SearchBar'
import Breadcrumbs from '../../elements/Breadcrumbs/Breadcrumbs'
import Container from '../../elements/Container/Container'
import Flex from '../../elements/Flex/Flex'

const Screen = ({
  breadcrumbs,
  children,
  onSearchParamsChange,
  searchParams,
}) => (
  <Container
    as={Flex}
    css={css({ flexDirection: 'column', height: '100%', pb: 0 })}
  >
    <SearchBar
      css={{ alignSelf: 'flex-end', width: '50%' }}
      onSearchParamsChange={onSearchParamsChange}
      {...searchParams}
    />
    <Breadcrumbs paths={breadcrumbs} />
    {children}
  </Container>
)

export default Screen
