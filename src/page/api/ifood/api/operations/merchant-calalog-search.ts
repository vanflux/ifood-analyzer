import { CacheFn, createCache } from "../../../../utils/cache";
import { getCoords } from "../../utils/get-location";
import { IfoodClient } from "../client";

export interface IfoodMerchantCatalog {
	menu: IfoodMerchantCatalogCategory[];
}

export interface IfoodMerchantCatalogCategory {
  code: string;
  name: string;
  itens: IfoodMerchantCatalogProduct[];
}

export interface IfoodMerchantCatalogProduct {
  id: string;
  code: string;
  description: string;
  logoUrl?: string;
  needChoices: boolean;
  unitPrice: number;
  unitMinPrice: number;
  sellingOption?: IfoodMerchantCatalogSellingOption;
  productTags?: IfoodMerchantCatalogProductTags[];
  productInfo?: IfoodMerchantCatalogProductInfo;
	details?: string;
}

export interface IfoodMerchantCatalogSellingOption {
  minimum: number;
  incremental: number;
  availableUnits: string[];
}

export interface IfoodMerchantCatalogProductTags {
  group: string;
  tags: string[];
}

export interface IfoodMerchantCatalogProductInfo {
  id: string;
  quantity: number;
  unit: string;
}

export class IfoodMerchantCatalogSearch {
  private cache: CacheFn<IfoodMerchantCatalog>;
  
  constructor(
    private client: IfoodClient,
    private merchantId: string,
  ) {
    this.cache = createCache(`ifood_merchant_catalog_search_${merchantId}`);
  }

  async getCatalog(): Promise<IfoodMerchantCatalog> {
    return this.cache(async () => {
      const coords = getCoords();
      if (!coords) throw new Error('Coords not found');
      const { latitude, longitude } = coords;
  
      const res = await this.client.makeCall<any>(
        'GET',
        `https://wsloja.ifood.com.br/ifood-ws-v3/v1/merchants/${this.merchantId}/catalog?latitude=${latitude}&longitude=${longitude}`,
        {},
      );
  
      if (res?.code !== '00') throw new Error('Error on getting merchant catalog, code = ' + res.code);
      
      return res.data;
    });
  }
}
