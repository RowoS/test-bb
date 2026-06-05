export type MenuVariant = {
    id: string;
    name: string;
    option: string;
    price_modifier: number;
};

export type MenuItem = {
    id: string;
    name: string;
    description: string | null;
    price: number;
    image: string | null;
    is_available: boolean;
    variants: MenuVariant[] | null;
};

export type MenuCategory = {
    id: string;
    name: string;
    display_order: number;
    items: MenuItem[] | null;
};

export interface EditProductModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    item: MenuItem;
    editFields: { name: string; description: string; price: string; image: string };
    setEditFields: React.Dispatch<React.SetStateAction<{ name: string; description: string; price: string; image: string }>>;
    categories: MenuCategory[];
    isLoading: boolean;
    onSave: (categoryId: string) => void;
}

export interface ProductFormModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    categories: MenuCategory[];
    onSubmit: (categoryId: string, item: {
        name: string;
        description?: string;
        price: number;
        image?: string;
    }) => Promise<void>;
    isLoading: boolean;
}

export interface AddCategoryModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (name: string) => Promise<void>;
    isLoading: boolean;
}
