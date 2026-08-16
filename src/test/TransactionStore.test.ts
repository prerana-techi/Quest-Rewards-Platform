import { describe, it, expect, beforeEach } from 'vitest';
import { useTransactionStore } from '@/store/useTransactionStore';

describe('useTransactionStore', () => {
  beforeEach(() => {
    useTransactionStore.getState().clearTransactions();
  });

  it('should create new transaction and track lifecycle', () => {
    const txId = useTransactionStore.getState().addTransaction({
      type: 'create_quest',
      title: 'Lock Escrow',
      description: 'Posting bounty',
    });

    expect(txId).toBeDefined();
    let tx = useTransactionStore.getState().transactions.find((t) => t.id === txId);
    expect(tx?.status).toBe('signing');

    useTransactionStore.getState().updateStatus(txId, 'submitting');
    tx = useTransactionStore.getState().transactions.find((t) => t.id === txId);
    expect(tx?.status).toBe('submitting');

    useTransactionStore.getState().updateStatus(txId, 'confirmed', 'hash123abc', undefined, '0.00001 XLM');
    tx = useTransactionStore.getState().transactions.find((t) => t.id === txId);
    expect(tx?.status).toBe('confirmed');
    expect(tx?.hash).toBe('hash123abc');
  });

  it('should support retry handlers on failure', () => {
    const txId = useTransactionStore.getState().addTransaction({
      type: 'submit_work',
      title: 'Submit PR',
      description: 'Submitting proof',
    });

    let retried = false;
    useTransactionStore.getState().setRetryAction(txId, async () => {
      retried = true;
    });

    useTransactionStore.getState().updateStatus(txId, 'failed', undefined, 'Simulation out of gas');
    const tx = useTransactionStore.getState().transactions.find((t) => t.id === txId);
    expect(tx?.status).toBe('failed');
    expect(tx?.error).toBe('Simulation out of gas');

    tx?.retryAction?.();
    expect(retried).toBe(true);
  });
});
