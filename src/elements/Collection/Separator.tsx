import type { PartialNode } from '@react-stately/collections'

function Separator(): JSX.Element | null {
  return null
}

Separator.getCollectionNode = function* getCollectionNode<T>(): Generator<
  PartialNode<T>
> {
  yield {
    type: 'separator',
    hasChildNodes: false,
    rendered: null,
  }
}

/**
 * Additional collection node type for `Separator`.
 *
 * @private
 *
 * @see https://react-spectrum.adobe.com/react-stately/collections.html
 * @see https://react-spectrum.adobe.com/react-stately/Collection.html#node-interface
 */
const _Separator = Separator as () => JSX.Element | null
export { _Separator as Separator }
