"use client";

import { Clock, ChevronDown, MapPinned, ListFilter, Eye } from 'lucide-react';
import { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/ui/table";
import { useVendorOrders } from '../hooks/useOrderPage';
import { OrderMap } from './OrderMapComponent';
import { statusBadgeClass, statusDotClass, getStatusOptions } from '../libs/order_Status';
import { OrderItemsModal } from './OrderItemModal';
import { VendorOrderActionsModal } from './VendorOrderActionsModal';

export function VendorsOrdersPage() {
    const { values, functions } = useVendorOrders();
    const { visibleOrders, isLoading, error, activeTab, counts, cancelReason } = values;
    const { setActiveTab, handleConfirm, handleDecline, handleStatusUpdate,
        setCancelReason, statusLabel } = functions;

    const [mapOverlay, setMapOverlay] = useState<{ lat: number; lng: number; address: string } | null>(null);
    const [selectedOrderForActions, setSelectedOrderForActions] = useState<typeof visibleOrders[0] | null>(null);
    const [selectedOrderForItems, setSelectedOrderForItems] = useState<typeof visibleOrders[0] | null>(null);

    function openMap(order: typeof visibleOrders[0]) {
        if (!order.latitude || !order.longitude) {
            setMapOverlay({ lat: 10.6769, lng: 124.8006, address: "Location not available" });
            return;
        }
        setMapOverlay({
            lat: order.latitude,
            lng: order.longitude,
            address: `${order.delivery_landmark}, ${order.delivery_barangay}, ${order.delivery_city}`,
        });
    }

    return (
        <div className="p-8" style={{ fontFamily: "'DM Sans', sans-serif" }}>

            {/* Tab Bar */}
            <div className="flex items-center gap-2 mb-6 flex-wrap">
                <div className="inline-flex rounded-md shadow-sm" role="group">
                    {([
                        { key: 'request', label: 'Order Requests', count: counts.request },
                        { key: 'running', label: 'Running Orders', count: counts.running },
                        { key: 'history', label: 'Order History',  count: null },
                    ] as const).map((tab, index) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`relative flex items-center gap-1.5 px-5 py-2 text-sm font-medium transition-all ${
                                index === 0 ? 'rounded-l-md' : ''
                            } ${
                                index === 2 ? 'rounded-r-md' : ''
                            } border ${
                                activeTab === tab.key
                                    ? 'z-10 bg-[#FF6B35] border-[#FF6B35] text-white'
                                    : 'bg-white border-[#ffe4d4] text-stone-500 hover:bg-orange-50'
                            }`}
                        >
                            {tab.key === 'request' && <Clock size={13} />}
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

            {/* Table */}
            <div className="rounded-2xl shadow-sm overflow-visible" style={{ background: "#ffffff", border: "1px solid #ffe4d4" }}>
                <div className="overflow-x-auto">
                    <Table className="min-w-[900px]">
                        <TableHeader>
                            <TableRow style={{ background: "linear-gradient(135deg, #fff5f0 0%, #fef3e2 100%)", borderBottom: "1px solid #ffe4d4" }}>
                                <TableHead className="text-xs font-semibold text-stone-500 uppercase tracking-wide text-center">Customer</TableHead>
                                <TableHead className="text-xs font-semibold text-stone-500 uppercase tracking-wide text-center">Order ID</TableHead>
                                <TableHead className="text-xs font-semibold text-stone-500 uppercase tracking-wide text-center">Items</TableHead>
                                <TableHead className="text-xs font-semibold text-stone-500 uppercase tracking-wide text-center">Date</TableHead>
                                <TableHead className="text-xs font-semibold text-stone-500 uppercase tracking-wide text-center">Location</TableHead>
                                <TableHead className="text-xs font-semibold text-stone-500 uppercase tracking-wide text-center">Fulfillment</TableHead>
                                {activeTab !== 'request' && (
                                    <TableHead className="text-xs font-semibold text-stone-500 uppercase tracking-wide text-center">Status</TableHead>
                                )}
                                <TableHead className="text-xs font-semibold text-stone-500 uppercase tracking-wide text-center">Total</TableHead>
                                <TableHead className="text-xs font-semibold text-stone-500 uppercase tracking-wide text-center">Actions</TableHead>
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
                                    {/* Customer */}
                                    <TableCell className="text-center align-middle">
                                        <div className="flex flex-col items-center gap-1">
                                            <p className="text-xs font-semibold text-stone-700">
                                                {order.customer_name ?? "Customer"}
                                            </p>
                                        </div>
                                    </TableCell>

                                    {/* Order ID */}
                                    <TableCell className="text-center align-middle">
                                        <p className="text-xs text-stone-500 font-mono">#{order.order_id.slice(0, 8)}</p>
                                    </TableCell>

                                    {/* Items */}
                                    <TableCell className="text-center align-middle">
                                        <button
                                            onClick={() => setSelectedOrderForItems(order)}
                                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-[#FF6B35] rounded-lg text-xs font-medium transition-colors"
                                        >
                                            <Eye size={12} />
                                            View {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                                        </button>
                                    </TableCell>

                                    {/* Date */}
                                    <TableCell className="text-center align-middle">
                                        <p className="text-xs text-stone-600">
                                            {new Date(order.created_at).toLocaleDateString("en-PH", {
                                                month: "short", day: "numeric", year: "numeric",
                                            })}
                                        </p>
                                        <p className="text-xs text-stone-400">
                                            {new Date(order.created_at).toLocaleTimeString("en-PH", {
                                                hour: "numeric", minute: "2-digit",
                                            })}
                                        </p>
                                    </TableCell>

                                    {/* Location */}
                                    <TableCell className="text-center align-middle">
                                        {order.fulfillment === 'delivery' && order.delivery_landmark ? (
                                            <button
                                                onClick={() => openMap(order)}
                                                className="inline-flex items-center gap-1 text-xs text-blue-500 hover:text-[#FF6B35] transition-colors"
                                            >
                                                <MapPinned size={12} />
                                                <span className="truncate max-w-[120px]">
                                                    {order.delivery_landmark}, {order.delivery_barangay}
                                                </span>
                                            </button>
                                        ) : order.fulfillment === 'pickup' && order.latitude && order.longitude ? (
                                            <button
                                                onClick={() => openMap(order)}
                                                className="inline-flex items-center gap-1 text-xs text-blue-500 hover:text-[#FF6B35] transition-colors"
                                            >
                                                <MapPinned size={12} />
                                                <span>View Location</span>
                                            </button>
                                        ) : (
                                            <p className="text-xs text-stone-400">—</p>
                                        )}
                                    </TableCell>

                                    {/* Fulfillment */}
                                    <TableCell className="text-center align-middle">
                                        <span className={`inline-flex text-xs font-semibold px-2 py-1 rounded-full ${
                                            order.fulfillment === 'delivery'
                                                ? 'bg-blue-50 text-blue-600'
                                                : 'bg-green-50 text-green-600'
                                        }`}>
                                            {order.fulfillment === 'delivery' ? 'Delivery' : 'Pick-up'}
                                        </span>
                                    </TableCell>

                                    {/* Status — hidden on request tab */}
                                    {activeTab !== 'request' && (
                                        <TableCell className="text-center align-middle">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${statusBadgeClass(order.status)}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${statusDotClass(order.status)}`} />
                                                {statusLabel(order.status)}
                                            </span>
                                            {order.cancel_reason && (
                                                <p className="text-[10px] text-stone-400 mt-1 max-w-[120px] truncate italic">
                                                    {order.cancel_reason}
                                                </p>
                                            )}
                                        </TableCell>
                                    )}

                                    {/* Total */}
                                    <TableCell className="text-center align-middle">
                                        <p className="text-sm font-bold text-[#1D3557]">₱{order.total.toFixed(2)}</p>
                                    </TableCell>

                                    {/* Actions */}
                                    <TableCell className="text-center align-middle">
                                        {activeTab !== 'history' ? (
                                            <button
                                                onClick={() => setSelectedOrderForActions(order)}
                                                className="border border-[#ffe4d4] rounded-lg w-8 h-8 flex items-center justify-center mx-auto hover:bg-orange-50 hover:border-orange-200 transition-colors text-stone-500"
                                            >
                                                <span className="text-lg">⋯</span>
                                            </button>
                                        ) : (
                                            <p className="text-xs text-stone-300">—</p>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Vendor Actions Modal */}
            {selectedOrderForActions && (
                <VendorOrderActionsModal
                    order={selectedOrderForActions}
                    activeTab={activeTab}
                    onConfirm={() => {
                        handleConfirm(selectedOrderForActions.order_id);
                        setSelectedOrderForActions(null);
                    }}
                    onDecline={(reason) => {
                        setCancelReason(reason);
                        handleDecline(selectedOrderForActions.order_id);
                        setSelectedOrderForActions(null);
                    }}
                    onStatusUpdate={(status) => {
                        handleStatusUpdate(selectedOrderForActions.order_id, status as any);
                        setSelectedOrderForActions(null);
                    }}
                    onClose={() => setSelectedOrderForActions(null)}
                />
            )}

            {/* Items Modal */}
            {selectedOrderForItems && (
                <OrderItemsModal
                    storeName={selectedOrderForItems.customer_name ?? "Customer"}
                    items={selectedOrderForItems.items}
                    onClose={() => setSelectedOrderForItems(null)}
                />
            )}

            {/* Map Modal */}
            {mapOverlay && (
                <OrderMap
                    isOpen={!!mapOverlay}
                    onClose={() => setMapOverlay(null)}
                    lat={mapOverlay.lat}
                    lng={mapOverlay.lng}
                    address={mapOverlay.address}
                />
            )}
        </div>
    );
}