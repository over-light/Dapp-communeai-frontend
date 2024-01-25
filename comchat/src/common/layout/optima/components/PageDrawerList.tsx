import * as React from 'react';

import type { SxProps } from '@mui/joy/styles/types';
import { ColorPaletteProp, List, VariantProp } from '@mui/joy';


export const PageDrawerTallItemSx: SxProps = {
  '--ListItem-minHeight': '3rem',
};


/**
 * Used by pluggable layouts to have a standardized list appearance
 */
export function PageDrawerList(props: {
  variant?: VariantProp,
  color?: ColorPaletteProp,
  onClick?: () => void,
  largeIcons?: boolean,
  tallRows?: boolean,
  noTopPadding?: boolean,
  noBottomPadding?: boolean,
  children: React.ReactNode
}) {

  return (
    <List
      variant={props.variant}
      color={props.color}
      onClick={props.onClick}
      sx={{
        // size of the list items
        '--List-radius': 0,
        ...props.largeIcons && {
          '--Icon-fontSize': 'var(--joy-fontSize-xl2)',
          '--ListItemDecorator-size': '2.75rem', // icon width
        },
        ...props.tallRows && PageDrawerTallItemSx,

        // style
        backgroundColor: 'background.popup',
        border: 'none',
        ...(!!props.noTopPadding && { pt: 0 }),
        ...(!!props.noBottomPadding && { pb: 0 }),

        // clipping/scrolling
        overflow: 'hidden',
      }}
    >
      {props.children}
    </List>
  );
}