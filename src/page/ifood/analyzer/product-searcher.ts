import { IfoodClient } from "../api/client";
import { IfoodMerchantCatalog, IfoodMerchantCatalogProduct, IfoodMerchantCatalogSearch } from "../api/operations/merchant-calalog-search";
import { IfoodMerchantSearch, IfoodMerchantSearchItem } from "../api/operations/merchant-search";

export interface IfoodProductSearcherItem {
  merchant: IfoodMerchantSearchItem;
  product: IfoodMerchantCatalogProduct;
}

export class IfoodProductSearcher {
  constructor(
    private client: IfoodClient,
    private merchantFilterFn: (item: IfoodMerchantSearchItem) => boolean,
    private productFilterFn: (item: IfoodProductSearcherItem) => boolean,
    private mocked = false,
  ) {}

  async search(): Promise<IfoodProductSearcherItem[]> {
    let filteredMerchants: IfoodMerchantSearchItem[];
    let catalogs: IfoodMerchantCatalog[];

    if (this.mocked) {
      console.log('Product searcher using mock');
      filteredMerchants = require('../mock/filtered-merchants.json');
      catalogs = require('../mock/merchants-catalog.json');
    } else {
      console.log('Product searcher using api');
      const merchantSearch = new IfoodMerchantSearch(this.client, 'sushi', 100);
      const merchants = await merchantSearch.getCurrent();
      filteredMerchants = merchants.filter(this.merchantFilterFn);
      catalogs = await Promise.all(filteredMerchants.map((x, i) => (
        new Promise<IfoodMerchantCatalog>(resolve => (
          setTimeout(() => resolve(new IfoodMerchantCatalogSearch(this.client, x.id).getCatalog()), i * 100)
        ))
      )));
      console.log('Merchants', merchants);
      console.log('Filtered merchants', filteredMerchants);
      console.log('Catalogs', catalogs);
    }

    const items = catalogs.flatMap((catalog, i) => catalog.menu.flatMap(menu => menu.itens.map(product => ({ product, merchant: filteredMerchants[i] }))));
    const filteredItems = items.filter(this.productFilterFn);

    console.log('Products length:', items.length);
    console.log('Filtered products length:', filteredItems.length);
    console.log('Product searcher final items:', filteredItems.map(x => ({
      description: x.product.description,
      details: x.product.details,
      price: x.product.unitPrice,
      merchantName: x.merchant.name,
      original: x,
    })).sort((a, b) => a.price - b.price));
    
    return filteredItems;
  }
}
