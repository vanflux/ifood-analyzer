import { CacheFn, createCache } from "../../../utils/cache";
import { getCoords } from "../utils/get-location";
import { IfoodClient } from "../client";

export interface IfoodMerchantSearchItem {
  action: string;
  available: boolean;
  contextMessage?: {
    icon: string;
    message: string;
    type: string;
  };
  currency: string;
  deliveryInfo: {
    deliveryMode?: string;
    fee: number;
    timeMaxMinutes?: number;
    timeMinMinutes?: number;
    type: string;
  };
  distance: number;
  id: string;
  imageUrl: string;
  isFavorite: boolean;
  isIfoodDelivery: boolean;
  isNew: boolean;
  isSuperRestaurant: boolean;
  mainCategory: string;
  name: string;
  supportsTracking: boolean;
  userRating: number;
}

export class IfoodMerchantSearch {
  private cache: CacheFn<IfoodMerchantSearchItem[]>;

  constructor(
    private client: IfoodClient,
    private term: string,
    private size = 100,
  ) {
    this.cache = createCache(`ifood_merchant_search_${term}`);
  }

  async getCurrent(): Promise<IfoodMerchantSearchItem[]> {
    return this.cache(async () => {
      const coords = getCoords();
      if (!coords) throw new Error('Coords not found');
      const { latitude, longitude } = coords;

      const res = await this.client.makeCall<any>(
        'POST',
        `https://marketplace.ifood.com.br/v2/cardstack/search/results?alias=CMS_RESULTS_MERCHANTS&latitude=${latitude}&longitude=${longitude}&channel=IFOOD&size=${this.size}&term=${this.term}`,
        {
          "supported-headers":["OPERATION_HEADER"],
          "supported-cards":["MERCHANT_LIST","CATALOG_ITEM_LIST","CATALOG_ITEM_LIST_V2","CATALOG_ITEM_LIST_V3","FEATURED_MERCHANT_LIST","CATALOG_ITEM_CAROUSEL","CATALOG_ITEM_CAROUSEL_V2","CATALOG_ITEM_CAROUSEL_V3","BIG_BANNER_CAROUSEL","IMAGE_BANNER","MERCHANT_LIST_WITH_ITEMS_CAROUSEL","SMALL_BANNER_CAROUSEL","NEXT_CONTENT","MERCHANT_CAROUSEL","MERCHANT_TILE_CAROUSEL","SIMPLE_MERCHANT_CAROUSEL","INFO_CARD","MERCHANT_LIST_V2","ROUND_IMAGE_CAROUSEL","BANNER_GRID","MEDIUM_IMAGE_BANNER","MEDIUM_BANNER_CAROUSEL","RELATED_SEARCH_CAROUSEL"],
          "supported-actions":["catalog-item","merchant","page","card-content","last-restaurants","webmiddleware","reorder","search","groceries","home-tab"],
          "feed-feature-name":"","faster-overrides":"",
        }
      );

      const mainSection = res?.sections?.[0];
      if (!mainSection) return [];
      const merchantListCard = mainSection.cards?.find((x: any) => x.cardType === 'MERCHANT_LIST_V2');
      const nextContentCard = mainSection.cards?.find((x: any) => x.cardType === 'NEXT_CONTENT');
      // TODO: implement page navigation
      if (!merchantListCard) return [];
      const merchantsContent = merchantListCard.data?.contents;
      if (!merchantsContent) return [];
      return merchantsContent;
    });
  }
}
