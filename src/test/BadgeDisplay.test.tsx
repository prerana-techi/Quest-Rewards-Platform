import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BadgeDisplay } from '@/components/BadgeDisplay';

describe('BadgeDisplay Component', () => {
  it('should render Gold Badge correctly', () => {
    render(<BadgeDisplay tier="Gold" title="Core Protocol Auditor" xp={250} />);
    expect(screen.getByText(/Gold/i)).toBeInTheDocument();
    expect(screen.getByText('Core Protocol Auditor')).toBeInTheDocument();
    expect(screen.getByText(/\+250 XP/i)).toBeInTheDocument();
  });

  it('should render Diamond Badge correctly in compact size', () => {
    render(<BadgeDisplay tier="Diamond" title="Champion" size="sm" />);
    expect(screen.getByText('Diamond')).toBeInTheDocument();
  });
});
