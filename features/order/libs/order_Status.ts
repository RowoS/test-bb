export const STATUS_BADGE_CLASS: Record<string, string> = {
  pending:          'bg-orange-100 text-orange-600 border border-orange-300',
  confirmed:        'bg-orange-100 text-orange-600 border border-orange-300',
  stand_by:         'bg-orange-100 text-orange-600 border border-orange-300',
  preparing:        'bg-blue-100 text-blue-700 border border-blue-300',
  out_for_delivery: 'bg-green-100 text-green-700 border border-green-300',
  ready_for_pickup: 'bg-green-100 text-green-700 border border-green-300',
  completed:        'bg-emerald-100 text-emerald-700 border border-emerald-300',
  cancelled:        'bg-red-100 text-red-500 border border-red-300',
};

export const STATUS_DOT_CLASS: Record<string, string> = {
  pending:          'bg-orange-400',
  confirmed:        'bg-orange-400',
  stand_by:         'bg-orange-400',
  preparing:        'bg-blue-400',
  out_for_delivery: 'bg-green-500',
  ready_for_pickup: 'bg-green-500',
  completed:        'bg-emerald-500',
  cancelled:        'bg-red-400',
};

export const DEFAULT_BADGE_CLASS = 'bg-stone-100 text-stone-500 border border-stone-300';
export const DEFAULT_DOT_CLASS   = 'bg-stone-400';

export function statusBadgeClass(status: string): string {
  return STATUS_BADGE_CLASS[status] ?? DEFAULT_BADGE_CLASS;
}

export function statusDotClass(status: string): string {
  return STATUS_DOT_CLASS[status] ?? DEFAULT_DOT_CLASS;
}

export function getStatusOptions(fulfillment: string) {
  return [
    { value: 'confirmed', label: 'Confirmed'  },
    { value: 'stand_by',  label: 'Stand By'   },
    { value: 'preparing', label: 'Preparing'  },
    {
      value: fulfillment === 'delivery' ? 'out_for_delivery' : 'ready_for_pickup',
      label: fulfillment === 'delivery' ? 'Out for Delivery' : 'Ready for Pickup',
    },
  ];
}