import { useState, useEffect } from 'react';
import { getCustomerOrders, cancelOrder, confirmReceived, statusLabel } from '../libs/order-actions';
import { CustomerOrder } from '../types/types';

export type CustomerOrderTab = 'all' | 'to_receive' | 'history';

const TAB_STATUSES: Record<CustomerOrderTab, string[]> = {
  all:        ['pending', 'confirmed', 'stand_by', 'preparing'],
  to_receive: ['out_for_delivery', 'ready_for_pickup'],
  history:    ['completed', 'cancelled'],
};

export function useCustomerOrders() {
  const [orders, setOrders]             = useState<CustomerOrder[]>([]);
  const [isLoading, setLoading]         = useState(true);
  const [error, setError]               = useState<string | null>(null);
  const [activeTab, setActiveTab]       = useState<CustomerOrderTab>('all');
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  async function fetchOrders() {
    setLoading(true);
    setError(null);
    try {
      const data = await getCustomerOrders();
      setOrders(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchOrders(); }, []);

  const visibleOrders = orders.filter(o => TAB_STATUSES[activeTab].includes(o.status));

  const counts = {
    all:        orders.filter(o => TAB_STATUSES.all.includes(o.status)).length,
    to_receive: orders.filter(o => TAB_STATUSES.to_receive.includes(o.status)).length,
    history:    orders.filter(o => TAB_STATUSES.history.includes(o.status)).length,
  };

  async function handleCancelOrder(orderId: string) {
    try {
      await cancelOrder(orderId, cancelReason.trim() || undefined);
      setCancellingId(null);
      setCancelReason('');
      await fetchOrders();
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function handleConfirmReceived(orderId: string) {
    try {
      await confirmReceived(orderId);
      await fetchOrders();
    } catch (err: any) {
      setError(err.message);
    }
  }

  return {
    values: { orders, visibleOrders, counts, isLoading, error, activeTab, cancellingId, cancelReason },
    functions: {
      setActiveTab,
      cancelOrder:      handleCancelOrder,
      confirmReceived:  handleConfirmReceived,
      setCancellingId,
      setCancelReason,
      statusLabel,
    },
  };
}