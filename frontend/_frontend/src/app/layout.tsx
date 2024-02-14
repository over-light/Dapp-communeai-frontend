'use client';

import type { Metadata } from 'next';
import '@fontsource/source-code-pro';
import './globals.css';
import Banner from './components/banner';
import Footer from './components/footer';
import NavigationBar from './components/navigation-bar';
import ThemeProvider from './toggle-theme-provider';

import Env from '../config';

import Head from './head';

//wagmi wallet connection
import '@rainbow-me/rainbowkit/styles.css';

import {
  RainbowKitProvider,
  darkTheme,
  connectorsForWallets,
  getWalletConnectConnector
} from '@rainbow-me/rainbowkit';
import {
  rainbowWallet,
  walletConnectWallet,
  trustWallet,
  enkryptWallet,
  okxWallet,
  ledgerWallet,
  talismanWallet,
  metaMaskWallet
} from '@rainbow-me/rainbowkit/wallets';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  zora,
  goerli,
} from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { createConfig, configureChains, WagmiConfig, sepolia } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import {
  Chain,
  Wallet,
} from '@rainbow-me/rainbowkit';

const { chains, publicClient } = configureChains(
  [mainnet, polygon, optimism, arbitrum, base, zora, sepolia, goerli],
  [
    alchemyProvider({ apiKey: Env.alchemyApi }),
    publicProvider()
  ]
);

// const { publicClient, webSocketPublicClient } = configureChains(
//   [mainnet],
//   [publicProvider()]
// );

const projectId = Env.projectId;

const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      metaMaskWallet({ projectId, chains }), // Metamask,
      ...(projectId ? [talismanWallet({ projectId, chains })] : []),
      ...(projectId ? [enkryptWallet({ projectId, chains })] : []),
      ...(projectId ? [trustWallet({ projectId, chains })] : []),
      // walletConnectWallet({ projectId, chains }),
      // trustWallet({ projectId, chains }),
      // Add more recommended wallets as needed
    ],
  },
  {
    groupName: 'Other',
    wallets: [
      ...(projectId ? [rainbowWallet({ projectId, chains })] : []),
      ...(projectId ? [okxWallet({ projectId, chains })] : []),
      ...(projectId ? [ledgerWallet({ projectId, chains })] : []),

      // rainbowWallet({ projectId, chains }),
      // coinbaseWallet({ projectId, chains }),
      // okxWallet({ projectId, chains }),
      // ledgerWallet({ projectId, chains }),
      // Add other wallets to the "Other" group
    ],
  },
]);

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
})

export interface MyWalletOptions {
  projectId: string;
  chains: Chain[];
}

export const rainbow = ({
  chains,
  projectId,
}: MyWalletOptions): Wallet => ({
  id: 'my-wallet',
  name: 'My Wallet',
  iconUrl: 'https://my-image.xyz',
  iconBackground: '#0c2f78',
  downloadUrls: {
    android: 'https://play.google.com/store/apps/details?id=my.wallet',
    ios: 'https://apps.apple.com/us/app/my-wallet',
    chrome: 'https://chrome.google.com/webstore/detail/my-wallet',
    qrCode: 'https://my-wallet/qr',
  },
  createConnector: () => {
    const connector = getWalletConnectConnector({ projectId, chains });

    return {
      connector,
      mobile: {
        getUri: async () => {
          const provider = await connector.getProvider();
          const uri = await new Promise<string>(resolve =>
            provider.once('display_uri', resolve)
          );
          return uri;
        },
      },
      qrCode: {
        getUri: async () => {
          const provider = await connector.getProvider();
          const uri = await new Promise<string>(resolve =>
            provider.once('display_uri', resolve)
          );
          return uri;
        },
        instructions: {
          learnMoreUrl: 'https://polkagate.xyz/',
          steps: [
            {
              description:
                'We recommend putting PolkaGate on your home screen for faster access to your wallet.',
              step: 'install',
              title: 'Open the PolkaGate app',
            },
            {
              description:
                'After you scan, a connection prompt will appear for you to connect your wallet.',
              step: 'scan',
              title: 'Tap the scan button',
            },
          ],
        },
      },
      extension: {
        instructions: {
          learnMoreUrl: 'https://chrome.google.com/webstore/detail/polkagate/ginchbkmljhldofnbjabmeophlhdldgp',
          steps: [
            {
              description:
                'We recommend pinning PolkaGate to your taskbar for quicker access to your wallet.',
              step: 'install',
              title: 'Install the PolkaGate extension',
            },
            {
              description:
                'Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.',
              step: 'create',
              title: 'Create or Import a Wallet',
            },
            {
              description:
                'Once you set up your wallet, click below to refresh the browser and load up the extension.',
              step: 'refresh',
              title: 'Refresh your browser',
            },
          ],
        },
      },
    };
  },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <Head />
      <body>
        <WagmiConfig config={wagmiConfig}>
          <RainbowKitProvider chains={chains} coolMode theme={darkTheme()}>
            {/* <Provider store={store}> */}
            <ThemeProvider>
              {/* <Banner /> */}
              <NavigationBar />
              {children}
              <Footer />
            </ThemeProvider>
            {/* </Provider> */}
          </RainbowKitProvider>
        </WagmiConfig>
      </body>
    </html>
  )
}
