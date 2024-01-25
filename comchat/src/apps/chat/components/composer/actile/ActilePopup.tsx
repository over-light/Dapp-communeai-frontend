import * as React from 'react';

import { Box, ListItem, ListItemButton, ListItemDecorator, Sheet, Typography } from '@mui/joy';

import { CloseableMenu } from '~/common/components/CloseableMenu';

import type { ActileItem } from './ActileProvider';


export function ActilePopup(props: {
  anchorEl: HTMLElement | null,
  onClose: () => void,
  title?: string,
  items: ActileItem[],
  activeItemIndex: number | undefined,
  activePrefixLength: number,
  onItemClick: (item: ActileItem) => void,
  children?: React.ReactNode
}) {

  const hasAnyIcon = props.items.some(item => !!item.Icon);

  return (
    <CloseableMenu open anchorEl={props.anchorEl} onClose={props.onClose} noTopPadding>

      {!!props.title && (
        <Sheet variant='soft' sx={{ p: 1, borderBottom: '1px solid', borderBottomColor: 'neutral.softActiveBg' }}>
          {/*<ListItemDecorator/>*/}
          <Typography level='title-md'>
            {props.title}
          </Typography>
        </Sheet>
      )}

      {!props.items.length && (
        <ListItem variant='soft' color='primary'>
          <Typography level='body-md'>
            No matching command
          </Typography>
        </ListItem>
      )}

      {props.items.map((item, idx) => {
          const labelBold = item.label.slice(0, props.activePrefixLength);
          const labelNormal = item.label.slice(props.activePrefixLength);
          return (
            <ListItemButton
              key={item.id}
              variant={idx === props.activeItemIndex ? 'soft' : undefined}
              onClick={() => props.onItemClick(item)}
            >
              {hasAnyIcon && (
                <ListItemDecorator>
                  {item.Icon ? <item.Icon /> : null}
                </ListItemDecorator>
              )}
              <Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography level='title-md' color='primary'>
                    <span style={{ fontWeight: 600, textDecoration: 'underline' }}>{labelBold}</span>{labelNormal}
                  </Typography>
                  {item.argument && <Typography level='body-sm'>
                    {item.argument}
                  </Typography>}
                </Box>

                {!!item.description && <Typography level='body-xs'>
                  {item.description}
                </Typography>}
              </Box>
            </ListItemButton>
          );
        },
      )}

      {props.children}

    </CloseableMenu>
  );
}