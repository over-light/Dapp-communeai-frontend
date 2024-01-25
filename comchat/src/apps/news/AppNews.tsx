import * as React from 'react';
import { keyframes } from '@emotion/react';
import TimeAgo from 'react-timeago';

import { Box, Button, Card, CardContent, Container, IconButton, Typography } from '@mui/joy';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { Brand } from '~/common/app.config';
import { GoodTooltip } from '~/common/components/GoodTooltip';
import { Link } from '~/common/components/Link';
import { ROUTE_INDEX } from '~/common/app.routes';
import { capitalizeFirstLetter } from '~/common/util/textUtils';
import { cssRainbowColorKeyframes, themeBgApp } from '~/common/app.theme';

import { newsCallout, NewsItems } from './news.data';

// number of news items to show by default, before the expander
const DEFAULT_NEWS_COUNT = 3;

export const cssColorKeyframes = keyframes`
    0%, 100% {
        color: #636B74; /* Neutral main color (500) */
    }
    25% {
        color: #12467B; /* Primary darker shade (700) */
    }
    50% {
        color: #0B6BCB; /* Primary main color (500) */
    }
    75% {
        color: #083e75; /* Primary lighter shade (300) */
    }`;


export function AppNews() {
  // state
  const [lastNewsIdx, setLastNewsIdx] = React.useState<number>(DEFAULT_NEWS_COUNT - 1);

  // news selection
  const news = NewsItems.filter((_, idx) => idx <= lastNewsIdx);
  const firstNews = news[0] ?? null;

  return (

    <Box sx={{
      flexGrow: 1,
      backgroundColor: themeBgApp,
      overflowY: 'auto',
      display: 'flex', justifyContent: 'center',
      p: { xs: 3, md: 6 },
    }}>

      <Box sx={{
        my: 'auto',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: 4,
      }}>

        <Typography level='h1' sx={{ fontSize: '3rem' }}>
          Welcome to {Brand.Title.Base} <Box component='span' sx={{ animation: `${cssColorKeyframes} 10s infinite` }}>{firstNews?.versionCode}</Box>!
        </Typography>

        <Typography>
          {capitalizeFirstLetter(Brand.Title.Base)} has been updated to version {firstNews?.versionCode}
        </Typography>

        <Box>
          <Button
            variant='solid' color='neutral' size='lg'
            component={Link} href={ROUTE_INDEX} noLinkStyle
            endDecorator='✨'
            sx={{ minWidth: 200 }}
          >
            Sweet
          </Button>
        </Box>

        {!!newsCallout && <Container disableGutters maxWidth='sm'>{newsCallout}</Container>}

        {!!news && <Container disableGutters maxWidth='sm'>
          {news?.map((ni, idx) => {
            // const firstCard = idx === 0;
            const hasCardAfter = news.length < NewsItems.length;
            const showExpander = hasCardAfter && (idx === news.length - 1);
            const addPadding = false; //!firstCard; // || showExpander;
            return <Card key={'news-' + idx} sx={{ mb: 2, minHeight: 32 }}>
              <CardContent sx={{ position: 'relative', pr: addPadding ? 4 : 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 0 }}>
                  <GoodTooltip title={ni.versionName ? `${ni.versionName} ${ni.versionMoji || ''}` : null} placement='top-start'>
                    <Typography level='title-sm' component='div' sx={{ flexGrow: 1 }}>
                      {ni.text ? ni.text : ni.versionName ? `${ni.versionCode} · ` : `Version ${ni.versionCode}:`}
                      <Box component='span' sx={!idx ? {
                        animation: `${cssRainbowColorKeyframes} 5s infinite`,
                        fontWeight: 600,
                      } : {}}>
                        {ni.versionName}
                      </Box>
                    </Typography>
                  </GoodTooltip>
                  {/*!firstCard &&*/ (
                    <Typography level='body-sm'>
                      {!!ni.versionDate && <TimeAgo date={ni.versionDate} />}
                    </Typography>
                  )}
                </Box>

                {!!ni.items && (ni.items.length > 0) && (
                  <ul style={{ marginTop: 8, marginBottom: 8, paddingInlineStart: '1.5rem' }}>
                    {ni.items.filter(item => item.dev !== true).map((item, idx) => <li key={idx}>
                      < Typography component='div' level='body-sm'>
                        {item.text}
                      </Typography>
                    </li>)}
                  </ul>
                )}

                {showExpander && (
                  <IconButton
                    variant='outlined'
                    onClick={() => setLastNewsIdx(idx + 1)}
                    sx={{
                      position: 'absolute', right: 0, bottom: 0, mr: -1, mb: -1,
                      backgroundColor: 'background.surface',
                      borderRadius: '50%',
                    }}
                  >
                    <ExpandMoreIcon />
                  </IconButton>
                )}

              </CardContent>
            </Card>;
          })}
        </Container>}

        {/*<Typography sx={{ textAlign: 'center' }}>*/}
        {/*  Enjoy!*/}
        {/*  <br /><br />*/}
        {/*  -- The {Brand.Title.Base} Team*/}
        {/*</Typography>*/}

      </Box>

    </Box>
  );
}