import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProfilePage from '@/app/profile/page';
import { useWalletStore } from '@/store/useWalletStore';

describe('ProfilePage Component', () => {
  beforeEach(() => {
    useWalletStore.getState().disconnect();
  });

  it('should render connect wallet prompt when disconnected', () => {
    render(<ProfilePage />);
    expect(screen.getByText('Connect Your Wallet')).toBeInTheDocument();
  });

  it('should render contributor level and reputation stats when connected', () => {
    useWalletStore.setState({
      address: 'GBRPYHIL2CI3FNQ4BXLFMNDLFJUNPU2HY3ZMFTGXDUTHXPIWNX6VOXR3',
      isConnected: true,
      balance: '120.50',
    });

    render(<ProfilePage />);
    expect(screen.getByText('Contributor Profile')).toBeInTheDocument();
    expect(screen.getByText('Verified On-Chain')).toBeInTheDocument();
    expect(screen.getByText('Total Bounties Won')).toBeInTheDocument();
  });
});
