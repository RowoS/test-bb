"use client";

import { Clock, MapPinned, ListFilter, ChevronDown, Info, Eye } from 'lucide-react';
import { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/ui/table";
import { OrderMap } from './OrderMapComponent';
import { ReviewModal } from '../../reviews/components/ReviewModal';
import { useCustomerOrders } from '../hooks/useCustomerOrders';
import { statusBadgeClass, statusDotClass } from '../libs/order_Status';
import { CustomerOrder } from '../types/types';
import { OrderActionsModal } from './OrderActionModal';
import { OrderItemsModal } from './OrderItemModal';

export function CustomerOrdersSection() {
    const { values, functions } = useCustomerOrders();
    const { visibleOrders, counts, isLoading, error, activeTab, cancellingId, cancelReason } = values;
    const { setActiveTab, cancelOrder, confirmReceived, setCancellingId, setCancelReason, statusLabel } = functions;
    const [reviewOrder, setReviewOrder] = useState<CustomerOrder | null>(null);
    const [mapOverlay, setMapOverlay] = useState<{ lat: number; lng: number; address: string } | null>(null);
    const [tooltipOrder, setTooltipOrder] = useState<string | null>(null);
    const [selectedOrderForActions, setSelectedOrderForActions] = useState<CustomerOrder | null>(null);
    const [selectedOrderForItems, setSelectedOrderForItems] = useState<CustomerOrder | null>(null);

    const canCancel = (status: string) => ['pending', 'stand_by'].includes(status);

    function openMap(order: CustomerOrder) {
        if (!order.latitude || !order.longitude) return;
        setMapOverlay({
            lat: order.latitude,
            lng: order.longitude,
            address: order.address ?? order.store_name,
        });
    }

    const handleCancelOrder = (orderId: string, reason: string) => {
        setCancellingId(orderId);
        setCancelReason(reason);
        cancelOrder(orderId);
        setSelectedOrderForActions(null);
    };

    const handleConfirmReceived = (orderId: string) => {
        confirmReceived(orderId);
        setSelectedOrderForActions(null);
    };

    const handleLeaveReview = (order: CustomerOrder) => {
        setReviewOrder(order);
        setSelectedOrderForActions(null);
    };

    return (
        <div style={{ fontFamily: "'DM Sans', sans-serif", background: "linear-gradient(135deg, #fafafa 0%, #fff8f5 100%)", minHeight: "100vh", padding: "2rem" }}>
            <div className="flex items-center mb-6 flex-wrap">
                <div className="inline-flex rounded-md shadow-sm" role="group">
                    {([
                        { key: 'all', label: 'All Orders', count: counts.all },
                        { key: 'to_receive', label: 'To Receive', count: counts.to_receive },
                        { key: 'history', label: 'Order History', count: null },
                    ] as const).map((tab, index) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`relative flex items-center gap-1.5 px-5 py-2 text-sm font-medium transition-all ${
                                index === 0 ? 'rounded-l-md' : ''
                            } ${
                                index === 2 ? 'rounded-r-md' : ''
                            } ${
                                index !== 0 && index !== 2 ? 'rounded-none' : ''
                            } border ${
                                activeTab === tab.key
                                    ? 'z-10 bg-[#FF6B35] border-[#FF6B35] text-white'
                                    : 'bg-white border-[#ffe4d4] text-stone-500 hover:bg-orange-50'
                            }`}
                        >
                            {tab.key === 'all' && <Clock size={13} />}
                            {tab.label}
                            {tab.count != null && tab.count > 0 && (
                                <span className={`ml-0.5 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center ${
                                    activeTab === tab.key
                                        ? 'bg-white text-[#FF6B35]'
                                        : 'bg-[#FF6B35] text-white'
                                }`}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                <button className="ml-auto flex items-center gap-1.5 px-4 py-2 rounded-md border border-[#ffe4d4] bg-white text-sm font-medium text-stone-500 hover:bg-orange-50 hover:border-orange-200">
                    <ListFilter size={13} />
                    Sort
                    <ChevronDown size={12} />
                </button>
            </div>

            <div className="rounded-2xl shadow-sm overflow-visible" style={{ background: "linear-gradient(135deg, #fafafa 0%, #fff8f5 100%)", border: "1px solid #ffe4d4" }}>
              <div className="overflow-x-auto">
                <Table className="min-w-[1000px]">
                    <TableHeader>
                        <TableRow style={{ background: "linear-gradient(135deg, #fff5f0 0%, #fef3e2 100%)", borderBottom: "1px solid #ffe4d4" }}>
                            <TableHead className="text-xs font-semibold text-stone-500 uppercase tracking-wide text-center">
                                Store
                            </TableHead>
                            <TableHead className="text-xs font-semibold text-stone-500 uppercase tracking-wide text-center">
                                Order ID
                            </TableHead>
                            <TableHead className="text-xs font-semibold text-stone-500 uppercase tracking-wide text-center">
                                Items
                            </TableHead>
                            <TableHead className="text-xs font-semibold text-stone-500 uppercase tracking-wide text-center">
                                Date
                            </TableHead>
                            <TableHead className="text-xs font-semibold text-stone-500 uppercase tracking-wide text-center">
                                Location
                            </TableHead>
                            <TableHead className="text-xs font-semibold text-stone-500 uppercase tracking-wide text-center">
                                Payment
                            </TableHead>
                            <TableHead className="text-xs font-semibold text-stone-500 uppercase tracking-wide text-center">
                                Status
                            </TableHead>
                            <TableHead className="text-xs font-semibold text-stone-500 uppercase tracking-wide text-center">
                                Total
                            </TableHead>
                            <TableHead className="text-xs font-semibold text-stone-500 uppercase tracking-wide text-center">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {isLoading && (
                            <TableRow>
                                <TableCell colSpan={9} className="py-16 text-center text-stone-400 text-sm">
                                    Loading orders...
                                </TableCell>
                            </TableRow>
                        )}

                        {error && (
                            <TableRow>
                                <TableCell colSpan={9} className="py-16 text-center text-red-400 text-sm">
                                    {error}
                                </TableCell>
                            </TableRow>
                        )}

                        {!isLoading && visibleOrders.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={9} className="py-16 text-center text-stone-400 text-sm">
                                    No orders here yet.
                                </TableCell>
                            </TableRow>
                        )}

                        {!isLoading && visibleOrders.map((order, index) => (
                            <TableRow 
                                key={order.order_id} 
                                className="transition-colors hover:bg-orange-50/50"
                                style={{ 
                                    background: index % 2 === 0 ? "#ffffff" : "#fffaf5",
                                    borderBottom: "1px solid #ffe4d4"
                                }}
                            >
                                <TableCell className="text-center align-middle">
                                    <div className="flex flex-col items-center gap-1">
                                        <p className="text-sm font-semibold text-stone-700">{order.store_name}</p>
                                    </div>
                                </TableCell>

                                <TableCell className="text-center align-middle">
                                    <p className="text-xs text-stone-500 font-mono">#{order.order_id.slice(0, 8)}</p>
                                </TableCell>

                                <TableCell className="text-center align-middle">
                                    <button
                                        onClick={() => setSelectedOrderForItems(order)}
                                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-[#FF6B35] rounded-lg text-xs font-medium transition-colors"
                                    >
                                        <Eye size={12} />
                                        View {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                                    </button>
                                </TableCell>

                                {/* Date */}
                                <TableCell className="text-center align-middle">
                                    <p className="text-xs text-stone-600">
                                        {new Date(order.created_at).toLocaleDateString("en-PH", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })}
                                    </p>
                                    <p className="text-xs text-stone-400">
                                        {new Date(order.created_at).toLocaleTimeString("en-PH", {
                                            hour: "numeric",
                                            minute: "2-digit",
                                        })}
                                    </p>
                                </TableCell>

                                {/* Location */}
                                <TableCell className="text-center align-middle">
                                    {order.fulfillment === 'pickup' && order.latitude && order.longitude ? (
                                        <button
                                            onClick={() => openMap(order)}
                                            className="inline-flex items-center gap-1 text-xs text-blue-500 hover:text-[#FF6B35] transition-colors"
                                        >
                                            <MapPinned size={12} />
                                            <span className="truncate max-w-[120px]">{order.address ?? order.store_name}</span>
                                        </button>
                                    ) : order.fulfillment === 'delivery' ? (
                                        <div className="inline-flex items-start gap-1">
                                            <MapPinned size={12} className="text-stone-400 mt-0.5 flex-shrink-0" />
                                            <p className="text-xs text-stone-500 leading-relaxed max-w-[140px]">
                                                {order.delivery_landmark}, {order.delivery_barangay}
                                            </p>
                                        </div>
                                    ) : (
                                        <p className="text-xs text-stone-400">—</p>
                                    )}
                                </TableCell>

                                {/* Payment / Fulfillment */}
                                <TableCell className="text-center align-middle">
                                    <span className={`inline-flex text-xs font-semibold px-2 py-1 rounded-full ${
                                        order.fulfillment === 'delivery'
                                            ? 'bg-blue-50 text-blue-600'
                                            : 'bg-green-50 text-green-600'
                                    }`}>
                                        {order.fulfillment === 'delivery' ? 'Delivery' : 'Pick-up'}
                                    </span>
                                </TableCell>

                                <TableCell className="text-center align-middle">
                                    <div className="relative inline-block">
                                        <button
                                            onClick={() => {
                                                if (order.cancel_reason && activeTab === 'history') {
                                                    setTooltipOrder(tooltipOrder === order.order_id ? null : order.order_id);
                                                }
                                            }}
                                            className="cursor-pointer"
                                            onMouseEnter={() => {
                                                if (order.cancel_reason && activeTab === 'history') {
                                                    setTooltipOrder(order.order_id);
                                                }
                                            }}
                                            onMouseLeave={() => {
                                                if (order.cancel_reason && activeTab === 'history') {
                                                    setTooltipOrder(null);
                                                }
                                            }}
                                        >
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${statusBadgeClass(order.status)}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${statusDotClass(order.status)}`} />
                                                {statusLabel(order.status)}
                                                {order.cancel_reason && activeTab === 'history' && (
                                                    <Info size={10} className="ml-0.5 opacity-70" />
                                                )}
                                            </span>
                                        </button>
                                        
                                        {/* Tooltip for cancellation reason */}
                                        {order.cancel_reason && activeTab === 'history' && tooltipOrder === order.order_id && (
                                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-20 whitespace-nowrap">
                                                <div className="font-medium mb-0.5">Cancellation Reason:</div>
                                                <div className="text-gray-300">{order.cancel_reason}</div>
                                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
                                            </div>
                                        )}
                                    </div>
                                    {order.notes && activeTab !== 'history' && (
                                        <p className="text-[10px] text-stone-400 mt-1 max-w-[140px] truncate">
                                            Note: {order.notes}
                                        </p>
                                    )}
                                </TableCell>

                                {/* Total */}
                                <TableCell className="text-center align-middle">
                                    <p className="text-sm font-bold text-[#1D3557]">₱{order.total.toFixed(2)}</p>
                                </TableCell>

                                {/* Actions - Button to open actions modal */}
                                <TableCell className="text-center align-middle">
                                    {activeTab === 'history' && order.status === 'completed' ? (
                                        <button
                                            onClick={() => handleLeaveReview(order)}
                                            className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-[#ffe4d4] rounded-lg text-xs font-medium text-stone-600 hover:bg-orange-50 hover:border-orange-200 transition-colors"
                                        >
                                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                                            </svg>
                                            {order.review_id ? 'Edit' : 'Review'}
                                        </button>
                                    ) : activeTab !== 'history' && (
                                        <button
                                            onClick={() => setSelectedOrderForActions(order)}
                                            className="border border-[#ffe4d4] rounded-lg w-8 h-8 flex items-center justify-center mx-auto hover:bg-orange-50 hover:border-orange-200 transition-colors text-stone-500"
                                        >
                                            <span className="text-lg">⋯</span>
                                        </button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
              </div>
            </div>

            {selectedOrderForActions && (
                <OrderActionsModal
                    order={selectedOrderForActions}
                    activeTab={activeTab}
                    canCancel={canCancel(selectedOrderForActions.status)}
                    onConfirmReceived={() => handleConfirmReceived(selectedOrderForActions.order_id)}
                    onCancelOrder={(reason) => handleCancelOrder(selectedOrderForActions.order_id, reason)}
                    onLeaveReview={() => handleLeaveReview(selectedOrderForActions)}
                    onClose={() => setSelectedOrderForActions(null)}
                />
            )}

            {/* Order Items Modal */}
            {selectedOrderForItems && (
                <OrderItemsModal
                    storeName={selectedOrderForItems.store_name}
                    items={selectedOrderForItems.items}
                    onClose={() => setSelectedOrderForItems(null)}
                />
            )}

            {mapOverlay && (
                <OrderMap
                    isOpen={!!mapOverlay}
                    onClose={() => setMapOverlay(null)}
                    lat={mapOverlay.lat}
                    lng={mapOverlay.lng}
                    address={mapOverlay.address}
                />
            )}

            {reviewOrder && (
                <ReviewModal
                    order={reviewOrder}
                    onClose={() => setReviewOrder(null)}
                    onSubmitted={() => setReviewOrder(null)}
                />
            )}
        </div>
    );
}