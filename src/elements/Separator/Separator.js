import css from '@styled-system/css'
import styled from 'styled-components/macro'

const Separator = styled('hr')(
  css({
    border: 'none',
    borderBottomColor: 'border',
    borderBottomStyle: 'solid',
    borderBottomWidth: 1,
    mt: 0,
    mb: 2,
  })
)

export default Separator
