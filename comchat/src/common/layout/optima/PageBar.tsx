import * as React from 'react';

import type { SxProps } from '@mui/joy/styles/types';
import { Box, IconButton, ListDivider, ListItemDecorator, MenuItem, Typography, useColorScheme } from '@mui/joy';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import MenuIcon from '@mui/icons-material/Menu';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

import type { NavItemApp } from '~/common/app.nav';
import { AgiSquircleIcon } from '~/common/components/icons/AgiSquircleIcon';
import { Brand } from '~/common/app.config';
import { CloseableMenu } from '~/common/components/CloseableMenu';
import { Link } from '~/common/components/Link';
import { ROUTE_INDEX } from '~/common/app.routes';

import { InvertedBar, InvertedBarCornerItem } from './components/InvertedBar';
import { MobileNavListItem } from './MobileNavListItem';
import { useOptimaDrawers } from './useOptimaDrawers';
import { useOptimaLayout } from './useOptimaLayout';


function PageBarItemsFallback() {
  return (
    <Link href={ROUTE_INDEX}>
      <AgiSquircleIcon inverted sx={{
        width: 32,
        height: 32,
        color: 'white',
      }} />
      <Typography sx={{
        ml: { xs: 1, md: 2 },
        color: 'white',
        textDecoration: 'none',
      }}>
        {Brand.Title.Base}
      </Typography>
    </Link>
  );
}


function CommonMenuItems(props: { onClose: () => void }) {

  // external state
  const { openPreferencesTab } = useOptimaLayout();
  const { mode: colorMode, setMode: setColorMode } = useColorScheme();

  const handleShowSettings = (event: React.MouseEvent) => {
    event.stopPropagation();
    openPreferencesTab();
    props.onClose();
  };

  const handleToggleDarkMode = (event: React.MouseEvent) => {
    event.stopPropagation();
    setColorMode(colorMode === 'dark' ? 'light' : 'dark');
  };

  return <>

    {/*<MenuItem onClick={handleToggleDarkMode}>*/}
    {/*  <ListItemDecorator><DarkModeIcon /></ListItemDecorator>*/}
    {/*  Dark*/}
    {/*  <Switch checked={colorMode === 'dark'} onChange={handleToggleDarkMode} sx={{ ml: 'auto' }} />*/}
    {/*</MenuItem>*/}

    {/* Preferences |...| Dark Mode Toggle */}
    {/*<Tooltip title={<KeyStroke combo='Ctrl + Shift + P' />}>*/}
    <MenuItem onClick={handleShowSettings}>
      <ListItemDecorator><SettingsOutlinedIcon /></ListItemDecorator>
      Preferences
      <IconButton
        variant='outlined'
        onClick={handleToggleDarkMode}
        sx={{ ml: 'auto' }}
      >
        {colorMode !== 'dark' ? <DarkModeIcon /> : <LightModeIcon />}
      </IconButton>
    </MenuItem>
    {/*</Tooltip>*/}

  </>;
}


// type ContainedAppType = 'chat' | 'data' | 'news';


/**
 * The top bar of the application, with pluggable Left and Right menus, and Center component
 */
export function PageBar(props: { currentApp?: NavItemApp, isMobile?: boolean, sx?: SxProps }) {

  // state
  // const [value, setValue] = React.useState<ContainedAppType>('chat');
  const pageMenuAnchor = React.useRef<HTMLButtonElement>(null);

  // external state
  const {
    appBarItems, appPaneContent, appMenuItems,
  } = useOptimaLayout();
  const {
    openDrawer,
    isPageMenuOpen, openPageMenu, closePageMenu,
  } = useOptimaDrawers();

  const commonMenuItems = React.useMemo(() => {
    return <CommonMenuItems onClose={closePageMenu} />;
  }, [closePageMenu]);

  // [Desktop] hide the app bar if the current app doesn't use it
  const desktopHide = !!props.currentApp?.hideBar && !props.isMobile;
  if (desktopHide)
    return null;

  return <>

    {/* This will animate the height from 0 to auto (and the bar is overflow:hidden */}
    {/* But we're not using it yet as a NextJS page transition is a full removal */}
    {/*<Box sx={{*/}
    {/*  display: 'grid',*/}
    {/*  gridTemplateRows: desktopHide ? '0fr' : '1fr',*/}
    {/*  transition: 'grid-template-rows 1.42s linear',*/}
    {/*}}>*/}

    <InvertedBar direction='horizontal' sx={props.sx}>

      {/* [Mobile] Drawer button */}
      {(!!props.isMobile || props.currentApp?.hideNav) && (
        <InvertedBarCornerItem>

          {(!appPaneContent || props.currentApp?.hideNav) ? (
            <IconButton component={Link} href={ROUTE_INDEX} noLinkStyle>
              <ArrowBackIcon />
            </IconButton>
          ) : (
            <IconButton disabled={!appPaneContent} onClick={openDrawer}>
              <MenuIcon />
            </IconButton>
          )}

        </InvertedBarCornerItem>
      )}

      {/* Center Items */}
      <Box sx={{
        flexGrow: 1,
        minHeight: 'var(--Bar)',
        display: 'flex', flexFlow: 'row wrap', justifyContent: 'center', alignItems: 'center',
        my: 'auto',
      }}>
        {desktopHide ? null : !!appBarItems ? appBarItems : <PageBarItemsFallback />}
      </Box>

      {/* Page Menu Anchor */}
      <InvertedBarCornerItem>
        <IconButton disabled={!pageMenuAnchor || (!appMenuItems && !props.isMobile)} onClick={openPageMenu} ref={pageMenuAnchor}>
          <MoreVertIcon />
        </IconButton>
      </InvertedBarCornerItem>

    </InvertedBar>

    {/*</Box>*/}


    {/* Page Menu */}
    <CloseableMenu
      maxHeightGapPx={56 + 24} noBottomPadding noTopPadding sx={{ minWidth: 320 }}
      open={isPageMenuOpen && !!pageMenuAnchor.current} anchorEl={pageMenuAnchor.current} onClose={closePageMenu}
      placement='bottom-end'
    >

      {/* Common (Preferences) */}
      {commonMenuItems}

      {/* App Menu Items */}
      {!!appMenuItems && <ListDivider sx={{ mt: 0 }} />}
      {!!appMenuItems && <Box sx={{ overflowY: 'auto' }}>{appMenuItems}</Box>}

      {/* [Mobile] Nav is implemented at the bottom of the Page Menu (for now) */}
      {!!props.isMobile && !!appMenuItems && <ListDivider sx={{ mb: 0 }} />}
      {!!props.isMobile && <MobileNavListItem currentApp={props.currentApp} />}

    </CloseableMenu>

  </>;
}