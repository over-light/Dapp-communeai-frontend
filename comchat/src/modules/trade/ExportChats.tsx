import * as React from 'react';

import { Badge, Box, Button, Typography } from '@mui/joy';
import DoneIcon from '@mui/icons-material/Done';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import IosShareIcon from '@mui/icons-material/IosShare';

import { getChatShowSystemMessages } from '../../apps/chat/store-app-chat';

import { backendCaps } from '~/modules/backend/state-backend';

import { Brand } from '~/common/app.config';
import { ConfirmationModal } from '~/common/components/ConfirmationModal';
import { Link } from '~/common/components/Link';
import { apiAsyncNode } from '~/common/util/trpc.client';
import { conversationTitle, DConversationId, getConversation } from '~/common/state/store-chats';
import { isBrowser } from '~/common/util/pwaUtils';
import { useUICounter } from '~/common/state/store-ui';

import type { PublishedSchema } from './server/pastegg';
import type { StoragePutSchema } from './server/link';
import { ExportedChatLink } from './ExportedChatLink';
import { ExportedPublish } from './ExportedPublish';
import { addChatLinkItem, useLinkStorageOwnerId } from './store-module-trade';
import { conversationToJsonV1, conversationToMarkdown, downloadAllConversationsJson, downloadConversationJson } from './trade.client';


export type ExportConfig = { dir: 'export', conversationId: DConversationId | null };

/// Returns a pretty link to the current page, for promo
function linkToOrigin() {
  let origin = isBrowser ? window.location.href : '';
  if (!origin || origin.includes('//localhost'))
    origin = Brand.URIs.OpenRepo;
  origin = origin.replace('https://', '');
  if (origin.endsWith('/'))
    origin = origin.slice(0, -1);
  return origin;
}


/**
 * Export Buttons and functionality
 */
export function ExportChats(props: { config: ExportConfig, onClose: () => void }) {

  // state
  const [downloadedState, setDownloadedState] = React.useState<'ok' | 'fail' | null>(null);
  const [downloadedAllState, setDownloadedAllState] = React.useState<'ok' | 'fail' | null>(null);
  const [chatLinkConfirmId, setChatLinkConfirmId] = React.useState<DConversationId | null>(null);
  const [chatLinkUploading, setChatLinkUploading] = React.useState(false);
  const [chatLinkResponse, setChatLinkResponse] = React.useState<StoragePutSchema | null>(null);
  const [publishConversationId, setPublishConversationId] = React.useState<DConversationId | null>(null);
  const [publishUploading, setPublishUploading] = React.useState(false);
  const [publishResponse, setPublishResponse] = React.useState<PublishedSchema | null>(null);

  // external state
  const enableSharing = backendCaps().hasDB;
  const { novel: chatLinkBadge, touch: clearChatLinkBadge } = useUICounter('share-chat-link');
  const { linkStorageOwnerId, setLinkStorageOwnerId } = useLinkStorageOwnerId();


  // chat link

  const handleChatLinkCreate = () => setChatLinkConfirmId(props.config.conversationId);

  const handleChatLinkConfirmed = async () => {
    if (!chatLinkConfirmId) return;

    const conversation = getConversation(chatLinkConfirmId);
    setChatLinkConfirmId(null);
    if (!conversation) return;

    setChatLinkUploading(true);
    try {
      const chatV1 = conversationToJsonV1(conversation);
      const chatTitle = conversationTitle(conversation) || undefined;
      const response: StoragePutSchema = await apiAsyncNode.trade.storagePut.mutate({
        ownerId: linkStorageOwnerId,
        dataType: 'CHAT_V1',
        dataTitle: chatTitle,
        dataObject: chatV1,
      });
      setChatLinkResponse(response);
      if (response.type === 'success') {
        addChatLinkItem(chatTitle, response.objectId, response.createdAt, response.expiresAt, response.deletionKey);
        if (!linkStorageOwnerId)
          setLinkStorageOwnerId(response.ownerId);
      }
      clearChatLinkBadge();
    } catch (error: any) {
      setChatLinkResponse({
        type: 'error',
        error: error?.message ?? error?.toString() ?? 'unknown error',
      });
    }
    setChatLinkUploading(false);
  };


  // publish

  const handlePublishConversation = () => setPublishConversationId(props.config.conversationId);

  const handlePublishConfirmed = async () => {
    if (!publishConversationId) return;

    const conversation = getConversation(publishConversationId);
    setPublishConversationId(null);
    if (!conversation) return;

    setPublishUploading(true);
    const showSystemMessages = getChatShowSystemMessages();
    const markdownContent = conversationToMarkdown(conversation, !showSystemMessages);
    try {
      const paste = await apiAsyncNode.trade.publishTo.mutate({
        to: 'paste.gg',
        title: '🤖💬 Chat Conversation',
        fileContent: markdownContent,
        fileName: 'my-chat.md',
        origin: linkToOrigin(),
      });
      setPublishResponse(paste);
    } catch (error: any) {
      alert(`Failed to publish conversation: ${error?.message ?? error?.toString() ?? 'unknown error'}`);
      setPublishResponse(null);
    }
    setPublishUploading(false);
  };

  const handlePublishResponseClosed = () => {
    setPublishResponse(null);
    props.onClose();
  };


  // download

  const handleDownloadConversation = () => {
    if (!props.config.conversationId) return;
    const conversation = getConversation(props.config.conversationId);
    if (!conversation) return;
    downloadConversationJson(conversation)
      .then(() => setDownloadedState('ok'))
      .catch(() => setDownloadedState('fail'));
  };

  const handleDownloadAllConversations = () => {
    downloadAllConversationsJson()
      .then(() => setDownloadedAllState('ok'))
      .catch(() => setDownloadedAllState('fail'));
  };


  const hasConversation = !!props.config.conversationId;

  return <>

    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center', py: 1 }}>
      <Typography level='title-sm'>
        Share / Download current chat:
      </Typography>

      <Button variant='soft' disabled={!hasConversation}
              color={downloadedState === 'ok' ? 'success' : downloadedState === 'fail' ? 'warning' : 'primary'}
              endDecorator={downloadedState === 'ok' ? <DoneIcon /> : downloadedState === 'fail' ? '✘' : <FileDownloadIcon />}
              sx={{ minWidth: 240, justifyContent: 'space-between' }}
              onClick={handleDownloadConversation}>
        Download chat
      </Button>

      {enableSharing && (
        <Badge color='danger' invisible={!chatLinkBadge}>
          <Button variant='soft' disabled={!hasConversation || chatLinkUploading}
                  loading={chatLinkUploading}
                  color={chatLinkResponse ? 'success' : 'primary'}
                  endDecorator={chatLinkResponse ? <DoneIcon /> : <IosShareIcon />}
                  sx={{ minWidth: 240, justifyContent: 'space-between' }}
                  onClick={handleChatLinkCreate}>
            Share on {Brand.Title.Base}
          </Button>
        </Badge>
      )}

      <Button variant='soft' disabled={!hasConversation || publishUploading}
              loading={publishUploading}
              color={publishResponse ? 'success' : 'primary'}
              endDecorator={<ExitToAppIcon />}
              sx={{ minWidth: 240, justifyContent: 'space-between' }}
              onClick={handlePublishConversation}>
        Publish to Paste.gg
      </Button>

      {/*<Button variant='soft' size='md' disabled sx={{ minWidth: 240, justifyContent: 'space-between', fontWeight: 400 }}>*/}
      {/*  Publish to ShareGPT*/}
      {/*</Button>*/}

      <Typography level='title-sm' sx={{ mt: 2 }}>
        Store / Transfer between devices:
      </Typography>
      <Button variant='soft' size='md'
              color={downloadedAllState === 'ok' ? 'success' : downloadedAllState === 'fail' ? 'warning' : 'primary'}
              endDecorator={downloadedAllState === 'ok' ? <DoneIcon /> : downloadedAllState === 'fail' ? '✘' : <FileDownloadIcon />}
              sx={{ minWidth: 240, justifyContent: 'space-between' }}
              onClick={handleDownloadAllConversations}>
        Download all chats
      </Button>
    </Box>


    {/* [chat link] confirmation */}
    {enableSharing && !!chatLinkConfirmId && (
      <ConfirmationModal
        open onClose={() => setChatLinkConfirmId(null)} onPositive={handleChatLinkConfirmed}
        title='Upload Confirmation'
        confirmationText={<>
          Everyone who has the unlisted link will be able to access this chat.
          It will be automatically deleted after 30 days.
          For more information, please see the <Link href={Brand.URIs.PrivacyPolicy} target='_blank'>privacy
          policy</Link> of this server. <br />
          Do you wish to continue?
        </>} positiveActionText={'Yes, Create Link'}
      />
    )}

    {/* [chat link] response */}
    {enableSharing && !!chatLinkResponse && (
      <ExportedChatLink open onClose={() => setChatLinkResponse(null)} response={chatLinkResponse} />
    )}


    {/* [publish] confirmation */}
    {publishConversationId && (
      <ConfirmationModal
        open onClose={() => setPublishConversationId(null)} onPositive={handlePublishConfirmed}
        confirmationText={<>
          Share your conversation anonymously on <Link href='https://paste.gg' target='_blank'>paste.gg</Link>?
          It will be unlisted and available to share and read for 30 days. Keep in mind, deletion may not be possible.
          Do you wish to continue?
        </>} positiveActionText={'Understood, Upload to Paste.gg'}
      />
    )}

    {/* [publish] response */}
    {!!publishResponse && (
      <ExportedPublish open onClose={handlePublishResponseClosed} response={publishResponse} />
    )}

  </>;
}