//
// Application Routes
//
// We will centralize them here, for UI and routing purposes.
//

import Router, { useRouter } from 'next/router';

import type { DConversationId } from '~/common/state/store-chats';
import { isBrowser } from './util/pwaUtils';


export const ROUTE_INDEX = '/';
export const ROUTE_APP_CHAT = '/';
export const ROUTE_APP_CALL = '/call';
export const ROUTE_APP_LINK_CHAT = '/link/chat/:linkId';
export const ROUTE_APP_NEWS = '/news';
export const ROUTE_APP_PERSONAS = '/personas';
const ROUTE_CALLBACK_OPENROUTER = '/link/callback_openrouter';


// Get Paths

export const getCallbackUrl = (source: 'openrouter') => {
  const callbackUrl = new URL(window.location.href);
  switch (source) {
    case 'openrouter':
      callbackUrl.pathname = ROUTE_CALLBACK_OPENROUTER;
      break;
    default:
      throw new Error(`Unknown source: ${source}`);
  }
  return callbackUrl.toString();
};

export const getChatLinkRelativePath = (chatLinkId: string) => ROUTE_APP_LINK_CHAT.replace(':linkId', chatLinkId);

export function useRouterQuery<TQuery>(): TQuery {
  const { query } = useRouter();
  return query as TQuery;
}

export function useRouterRoute(): string {
  const { route } = useRouter();
  return route;
}


/// Simple Navigation

export const navigateToIndex = navigateFn(ROUTE_INDEX);

export const navigateToNews = navigateFn(ROUTE_APP_NEWS);

export const navigateToPersonas = navigateFn(ROUTE_APP_PERSONAS);

export const navigateBack = Router.back;

export const reloadPage = () => isBrowser && window.location.reload();

function navigateFn(path: string) {
  return (replace?: boolean): Promise<boolean> => Router[replace ? 'replace' : 'push'](path);
}


/// Launch Apps

/* Note: not used yet
export interface AppChatQueryParams {
  conversationId?: string;
}*/

export const launchAppChat = async (conversationId?: DConversationId) => {
  await Router.push(
    {
      pathname: ROUTE_APP_CHAT,
      query: conversationId ? {
          conversationId,
        } /*satisfies AppChatQueryParams*/
        : undefined,
    },
    ROUTE_APP_CHAT,
  );
};

export interface AppCallQueryParams {
  conversationId: string;
  personaId: string;
}

export function launchAppCall(conversationId: string, personaId: string) {
  void Router.push(
    {
      pathname: ROUTE_APP_CALL,
      query: {
        conversationId,
        personaId,
      } satisfies AppCallQueryParams,
    },
    // ROUTE_APP_CALL,
  ).then();
}