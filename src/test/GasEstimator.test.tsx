import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GasEstimator } from '@/components/GasEstimator';

describe('GasEstimator Component', () => {
  it('should render CPU and storage metrics for create_quest', () => {
    render(<GasEstimator operation="create_quest" estimatedXlmFee="0.00001 XLM" />);
    expect(screen.getByText('Soroban Gas & Resource Footprint')).toBeInTheDocument();
    expect(screen.getByText('0.00001 XLM')).toBeInTheDocument();
    expect(screen.getByText('CPU Instructions')).toBeInTheDocument();
    expect(screen.getByText('RAM Footprint')).toBeInTheDocument();
  });

  it('should render review_submission resource footprint', () => {
    render(<GasEstimator operation="review_submission" estimatedXlmFee="0.00002 XLM" />);
    expect(screen.getByText('0.00002 XLM')).toBeInTheDocument();
    expect(screen.getByText(/Direct SAC payout \+ Inter-contract reputation call/i)).toBeInTheDocument();
  });
});
