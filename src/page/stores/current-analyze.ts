import create from 'zustand'
import { IfoodClient, IfoodMerchantCatalog, IfoodMerchantCatalogProduct, IfoodMerchantCatalogSearch, IfoodMerchantSearch, IfoodMerchantSearchItem } from '../api/ifood';
import { totalPrice } from '../utils/product';

export interface IfoodItem {
  merchant: IfoodMerchantSearchItem;
  product: IfoodMerchantCatalogProduct;
}

interface CurrentAnalyzerStore {
  merchants: IfoodMerchantSearchItem[];
  filteredMerchants: IfoodMerchantSearchItem[];
  items: IfoodItem[];
  searchMerchs(client: IfoodClient, term: string): Promise<IfoodMerchantSearchItem[]>;
  searchItems(
    client: IfoodClient,
    merchantFilter: (merchant: IfoodMerchantSearchItem) => boolean,
    productFilter: (product: IfoodMerchantCatalogProduct) => boolean,
  ): Promise<IfoodItem[]>;
};

export const useCurrentAnalyzeStore = create<CurrentAnalyzerStore>((set, getState) => ({
  merchants: [],
  filteredMerchants: [],
  items: [],
  async searchMerchs(client: IfoodClient, term: string) {
    const merchantSearch = new IfoodMerchantSearch(client, term, 100);
    const merchants = await merchantSearch.getCurrent();
    const sortedMerchants = merchants.sort((a, b) => b.userRating - a.userRating);
    set((state) => ({ merchants: sortedMerchants }));
    return sortedMerchants;
  },
  async searchItems(
    client: IfoodClient,
    merchantFilter: (merchant: IfoodMerchantSearchItem) => boolean,
    productFilter: (product: IfoodMerchantCatalogProduct) => boolean,
  ) {
    const merchants = getState().merchants;
    const filteredMerchants = merchants.filter(merchantFilter);

    const catalogs = await Promise.all(filteredMerchants.map((x, i) => new IfoodMerchantCatalogSearch(client, x.id).getCatalog()));
    console.log('Catalogs', catalogs);

    const items = catalogs.flatMap((catalog, i) => catalog.menu.flatMap(menu => menu.itens.map(product => ({ product, merchant: filteredMerchants[i] }))));
    const filteredItems = items.filter(item => productFilter(item.product));
    const sortedItems = filteredItems.sort((a, b) => totalPrice(a) - totalPrice(b));

    set(() => ({ filteredMerchants, items: sortedItems }));

    return sortedItems;
  }
}));
