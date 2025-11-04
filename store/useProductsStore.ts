import {create} from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Product = {
	id: number | string;
	title: string;
	description: string;
	price?: number;
	image?: string;
	created?: boolean;
	thumbnail?: string;
	images?: string[];
	category?: string; // added: some public APIs (fakestore) provide category
};

type FilterState = {
	category?: string;
	minPrice?: number;
	maxPrice?: number;
};

type State = {
	products: Product[];
	likes: Record<string, boolean>;
	setProducts: (items: Product[]) => void;
	addProduct: (item: Product) => void;
	removeProduct: (id: Product['id']) => void;
	toggleLike: (id: Product['id']) => void;
	getById: (id: Product['id']) => Product | undefined;
	clearAll: () => void;

	// New methods:
	editProduct: (id: Product['id'], patch: Partial<Product>) => void;
	upsertProduct: (item: Product) => void;
	setLike: (id: Product['id'], value: boolean) => void;
	fetchAndSetProducts: () => Promise<void>;

	// Pagination / filtering / search:
	page: number;
	pageSize: number;
	setPage: (p: number) => void;
	setPageSize: (n: number) => void;

	filter: FilterState;
	setFilter: (f: FilterState) => void;
	clearFilter: () => void;

	searchQuery: string;
	setSearchQuery: (q: string) => void;
	clearSearch: () => void;

	// Selectors (functions that compute from current state)
	getFilteredProducts: () => Product[];
	getVisibleProducts: () => Product[];
	getTotalPages: () => number;
};

const API = 'https://dummyjson.com/products?limit=100';

export const useProductsStore = create<State>()(
	persist(
		(set, get) => ({
			products: [],
			likes: {},
			setProducts: (items) => {
				set({ products: items, page: 1 }); // reset page
			},
			addProduct: (item) =>
				set((s) => ({ products: [item, ...s.products] })),
			removeProduct: (id) =>
				set((s) => ({ products: s.products.filter((p) => String(p.id) !== String(id)) })),
			toggleLike: (id) =>
				set((s) => {
					const key = String(id);
					const likes = { ...s.likes, [key]: !s.likes[key] };
					return { likes };
				}),
			getById: (id) => get().products.find((p) => String(p.id) === String(id)),
			clearAll: () => set({ products: [], likes: {} }),

			// ...new implementations...
			editProduct: (id, patch) =>
				set((s) => ({
					products: s.products.map((p) =>
						String(p.id) === String(id) ? { ...p, ...patch } : p
					),
				})),

			upsertProduct: (item) =>
				set((s) => {
					const exists = s.products.some((p) => String(p.id) === String(item.id));
					if (exists) {
						return {
							products: s.products.map((p) =>
								String(p.id) === String(item.id) ? { ...p, ...item } : p
							),
						};
					}
					return { products: [item, ...s.products] };
				}),

			setLike: (id, value) =>
				set((s) => {
					const key = String(id);
					return { likes: { ...s.likes, [key]: !!value } };
				}),

			fetchAndSetProducts: async () => {
				// guard for SSR
				if (typeof window === 'undefined') return;
				try {
					const res = await fetch(API);
					if (!res.ok) return;
					// DummyJSON returns { products: [...], total, skip, limit }
					const payload = await res.json();
					const data: Product[] = Array.isArray(payload.products) ? payload.products : [];
					const normalized = data.map((p) => ({
						...p,
						id: p.id,
						title: p.title,
						description: p.description,
						price: typeof p.price === 'number' ? p.price : undefined,
						image: p.thumbnail || (Array.isArray(p.images) && p.images[0]) || undefined,
						category: p.category,
					}));
					set({ products: normalized, page: 1 });
				} catch (e) {
					// fail silently — caller can handle UI state
					console.error('fetchAndSetProducts error', e);
				}
			},

			// Pagination / filter / search initial state
			page: 1,
			pageSize: 8,
			setPage: (p) => set(() => ({ page: Math.max(1, p) })),
			setPageSize: (n) =>
				set(() => {
					const size = Math.max(1, Math.floor(n) || 1);
					return { pageSize: size, page: 1 };
				}),

			filter: {},
			setFilter: (f) => set(() => ({ filter: f, page: 1 })),
			clearFilter: () => set(() => ({ filter: {}, page: 1 })),

			searchQuery: '',
			setSearchQuery: (q) => set(() => ({ searchQuery: q, page: 1 })),
			clearSearch: () => set(() => ({ searchQuery: '', page: 1 })),

			// Selectors
			getFilteredProducts: () => {
				const s = get();
				const q = (s.searchQuery || '').trim().toLowerCase();
				let list = s.products.slice();

				// search by title/description
				if (q) {
					list = list.filter((p) => {
						const t = (p.title || '').toLowerCase();
						const d = (p.description || '').toLowerCase();
						return t.includes(q) || d.includes(q);
					});
				}

				// filter by category
				if (s.filter?.category) {
					list = list.filter((p) => String(p.category || '').toLowerCase() === String(s.filter.category).toLowerCase());
				}

				// filter by price range
				if (typeof s.filter?.minPrice === 'number') {
					list = list.filter((p) => (typeof p.price === 'number' ? p.price >= (s.filter!.minPrice as number) : false));
				}
				if (typeof s.filter?.maxPrice === 'number') {
					list = list.filter((p) => (typeof p.price === 'number' ? p.price <= (s.filter!.maxPrice as number) : false));
				}

				return list;
			},

			getVisibleProducts: () => {
				const s = get();
				const filtered = get().getFilteredProducts();
				const start = (s.page - 1) * s.pageSize;
				return filtered.slice(start, start + s.pageSize);
			},

			getTotalPages: () => {
				const s = get();
				const total = get().getFilteredProducts().length;
				return Math.max(1, Math.ceil(total / s.pageSize));
			},
		}),
		{
			name: 'alfa-products-storage',
			// storage: () => (typeof window !== 'undefined' ? localStorage : undefined),
			storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : undefined) as Storage),
		}
	)
);