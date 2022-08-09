import safeEval from 'safe-eval';
import create from 'zustand'
import { IfoodClient, IfoodMerchantCatalogProduct, IfoodMerchantCatalogSearch, IfoodMerchantSearch, IfoodMerchantSearchItem } from '../api/ifood';
import { transpile } from '../lib/monaco';
import { SavedAnalyzer } from '../types/saved-analyzer';
import { totalPrice } from '../utils/product';

export interface IfoodItem {
  merchant: IfoodMerchantSearchItem;
  product: IfoodMerchantCatalogProduct;
}

export type MerchantFilter = (merchant: IfoodMerchantSearchItem) => boolean;
export type ProductFilter = (product: IfoodMerchantCatalogProduct) => boolean;

interface CurrentAnalyzerStore {
  merchants: IfoodMerchantSearchItem[];
  filteredMerchants: IfoodMerchantSearchItem[];
  items: IfoodItem[];
  merchantFilter?: MerchantFilter,
  productFilter?: ProductFilter,
  searchMerchs(client: IfoodClient, term: string): Promise<IfoodMerchantSearchItem[]>;
  searchItems(client: IfoodClient): Promise<IfoodItem[]>;
  buildFilters(savedAnalyzer: SavedAnalyzer): Promise<{merchantFilter?: MerchantFilter, productFilter?: ProductFilter}>;
};

export const useCurrentAnalyzeStore = create<CurrentAnalyzerStore>((set, get) => ({
  merchants: [],
  filteredMerchants: [],
  items: [],
  async searchMerchs(client: IfoodClient, term: string) {
    const merchantSearch = new IfoodMerchantSearch(client, term, 100);
    const merchants = await merchantSearch.getCurrent();
    const sortedMerchants = merchants.sort((a, b) => b.userRating - a.userRating);
    set(() => ({ merchants: sortedMerchants }));
    return sortedMerchants;
  },
  async searchItems(client: IfoodClient) {
    const { merchants, productFilter, merchantFilter } = get();
    if (!productFilter || !merchantFilter) return [];
    
    const filteredMerchants = merchants.filter(merchantFilter);
    const catalogs = await Promise.all(filteredMerchants.map((x, i) => new IfoodMerchantCatalogSearch(client, x.id).getCatalog()));
    const items = catalogs.flatMap((catalog, i) => catalog.menu.flatMap(menu => menu.itens.map(product => ({ product, merchant: filteredMerchants[i] }))));
    const filteredItems = items.filter(item => productFilter(item.product));
    const sortedItems = filteredItems.sort((a, b) => totalPrice(a) - totalPrice(b));
    set(() => ({ filteredMerchants, items: sortedItems }));
    return sortedItems;
  },
  async buildFilters(savedAnalyzer: SavedAnalyzer) {
    const tsCode = savedAnalyzer.tsCode;
    if (!tsCode) return get();
    console.log('Transpiling ts to js...');
    const jsCode = await transpile(tsCode);
    try {
      console.log('Building filter functions...');
      const { merchantFilter, productFilter } = safeEval(`(()=>{${jsCode};return {merchantFilter,productFilter}})()`);
      console.log('Filter functions built!');
      set(() => ({ merchantFilter, productFilter }));
      return {merchantFilter, productFilter};
    } catch (exc) {
      console.error('Build filter error:');
      console.error(exc);
    }
    return {};
  },
}));
