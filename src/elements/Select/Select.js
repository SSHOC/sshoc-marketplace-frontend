import css from '@styled-system/css'
import variant from '@styled-system/variant'
import { useSelect } from 'downshift'
import React, { forwardRef } from 'react'
import styled from 'styled-components/macro'
import Box from '../Box/Box'
import Button from '../Button/Button'
import Checkmark from '../Checkmark/Checkmark'
import Chevron from '../Chevron/Chevron'

// TODO: Let's see if we need to put the popover into a Portal

const Menu = styled('ul')(props =>
  css({
    bg: 'background',
    borderColor: 'border',
    borderRadius: 2,
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: 'small',
    display: 'block',
    listStyle: 'none',
    m: 0,
    maxHeight: 200,
    minWidth: '100%',
    mt: 1,
    opacity: props.open ? 1 : 0,
    position: 'absolute',
    px: 0,
    py: 2,
    overflowY: 'auto',
    transition: 'box-shadow 0.2s ease-out',
    whiteSpace: 'nowrap',
    '&:focus': {
      boxShadow: theme =>
        [theme.shadows.small, theme.shadows.outline].join(', '),
      outline: 'none',
      zIndex: 'focus',
    },
    zIndex: 'select',
  })
)

const Option = styled('li')(
  props =>
    css({
      bg: props.highlighted ? 'subtler' : 'transparent',
      color:
        props.highlighted || (props.checkSelected && props.selected)
          ? 'primary'
          : 'text',
      cursor: 'pointer',
      display: 'flex',
      px: 3,
      py: 2,
      '&:active': {
        color: 'text',
      },
    }),
  props =>
    variant({
      variants: {
        primary: {
          bg: props.highlighted ? 'primary' : 'transparent',
          color: props.highlighted ? 'white' : 'text',
        },
      },
    })
)

const Select = forwardRef(
  (
    {
      checkSelected,
      className,
      initialValue,
      items,
      onChange,
      variant,
      ...props
    },
    ref
  ) => {
    const {
      getItemProps,
      getMenuProps,
      getToggleButtonProps,
      highlightedIndex,
      isOpen,
      selectedItem,
    } = useSelect({
      defaultSelectedItem: initialValue || items[0],
      items,
      itemToString: item => (item ? item.label : ''),
      onSelectedItemChange: ({ selectedItem }) => onChange(selectedItem),
    })

    return (
      <Box css={css({ display: 'inline-block', position: 'relative' })}>
        <Button
          className={className}
          css={css({ bg: isOpen ? 'subtler' : undefined })}
          ref={ref}
          variant={variant}
          {...getToggleButtonProps()}
        >
          {selectedItem.label}
          <Chevron
            css={css({ ml: 2, pointerEvents: 'none' })}
            direction={isOpen ? 'up' : 'down'}
          />
        </Button>
        <Menu open={isOpen} {...getMenuProps()}>
          {isOpen
            ? items.map((item, index) => (
                <Option
                  checkSelected={checkSelected}
                  highlighted={highlightedIndex === index}
                  key={item.value}
                  selected={selectedItem.value === item.value}
                  variant={variant}
                  {...getItemProps({ item, index })}
                >
                  {checkSelected ? (
                    <span
                      css={css({
                        alignItems: 'center',
                        display: 'flex',
                        pr: 4,
                      })}
                    >
                      <Checkmark
                        css={css({
                          opacity: selectedItem.value === item.value ? 1 : 0,
                          pointerEvents: 'none',
                          mr: 2,
                        })}
                      />
                      {item.label}
                    </span>
                  ) : (
                    item.label
                  )}
                </Option>
              ))
            : null}
        </Menu>
      </Box>
    )
  }
)

export default Select
