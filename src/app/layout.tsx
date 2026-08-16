import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { WalletConnectModal } from '@/components/WalletConnectModal';
import { CreateQuestModal } from '@/components/CreateQuestModal';
import { SubmitWorkModal } from '@/components/SubmitWorkModal';
import { ReviewSubmissionModal } from '@/components/ReviewSubmissionModal';
import { TransactionToast } from '@/components/TransactionToast';

export const metadata: Metadata = {
  title: 'Quest & Rewards Platform | On-Chain Bounty Platform on Stellar Soroban',
  description:
    'Decentralized bounty and hackathon quest platform built on Stellar & Soroban smart contracts. Lock rewards in escrow, verify submissions trustlessly, and auto-release payouts.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen flex flex-col justify-between">
        <div>
          <Navbar />
          <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">{children}</main>
        </div>
        <Footer />
        <WalletConnectModal />
        <CreateQuestModal />
        <SubmitWorkModal />
        <ReviewSubmissionModal />
        <TransactionToast />
      </body>
    </html>
  );
}
