/**
 * Typescript helpers for polymorphic components with `as` prop.
 *
 * @see https://codesandbox.io/s/typescript-as-prop-dicj8
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import * as React from 'react'

/**
 * @example
 * type Test = As<{ prop: string }>
 */
type As<Props = any> = React.ElementType<Props>

/**
 * @example
 * type Test = PropsWithAs<{ prop: string }, As<{ prop2: string }>>['as']
 * type Test = PropsWithAs<{ prop: string }, As<{ prop2: string }>>['prop']
 * type Test = PropsWithAs<{ prop: string }, As<{ prop2: string }>>['prop2']
 * type Test = PropsWithAs<{ prop: string }, 'a'>['as']
 * type Test = PropsWithAs<{ prop: string }, 'a'>['href']
 */
export type PropsWithAs<Props = unknown, Type extends As = As> = Props &
  Omit<React.ComponentProps<Type>, 'as' | keyof Props> & {
    as?: Type
  }

/**
 * @example
 * type Test = ComponentWithAs<{ prop: string }, "button">
 */
export type ComponentWithAs<Props, DefaultType extends As> = {
  <Type extends As>(props: PropsWithAs<Props, Type> & { as: Type }): JSX.Element
  (props: PropsWithAs<Props, DefaultType>): JSX.Element
}

/**
 * @example
 * type ButtonProps = {
 *   isDisabled?: boolean
 * }
 *
 * function ButtonComponent(
 *   props: PropsWithAs<ButtonProps, 'button'>,
 *   ref: React.Ref<HTMLButtonElement>,
 * ) {
 *   const { as: Type = 'button', isDisabled, ...rest } = props
 *   return <Type disabled={isDisabled} ref={ref} {...rest} />
 * }
 *
 * const Button = forwardRefWithAs<ButtonProps, 'button'>(ButtonComponent)
 */
export function forwardRefWithAs<Props, DefaultType extends As>(
  component: React.ForwardRefRenderFunction<any, any>,
): ComponentWithAs<Props, DefaultType> {
  return (React.forwardRef(component) as unknown) as ComponentWithAs<
    Props,
    DefaultType
  >
}
