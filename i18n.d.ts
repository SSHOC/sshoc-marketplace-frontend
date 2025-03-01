import authenticated from './src/messages/authenticated/en'
import common from './src/messages/common/en'

const messages = { authenticated, common }
type Messages = typeof messages

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface IntlMessages extends Messages {}
}
