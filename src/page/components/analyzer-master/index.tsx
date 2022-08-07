import styles from "./styles.module.css";
import React, { useState, useEffect } from "react";
import { IfoodMerchantCatalogProduct, IfoodClient, IfoodMerchantSearchItem, IfoodProductSearcher, IfoodProductSearcherItem } from "../../api/ifood";
import { ItemList } from "../item-list";
import { Button } from "../button";
import { SavedAnalyzer } from "../../types/saved-analyzer";
import { useSavedAnalyzersStore } from "../../stores/saved-analyzers";

const myMerchantFilter = (merchant: IfoodMerchantSearchItem) => {
  return merchant.available && merchant.currency === 'BRL' && merchant.userRating >= 4.4 && merchant.deliveryInfo.fee === 0;
};

const mySushiFilter = (product: IfoodMerchantCatalogProduct) => {
  const txt = ((product.description || '') + '\n' + (product.details || '')).toLowerCase();
  return txt.includes('combo') && !txt.includes('skin') && txt.includes('sushi') && !txt.includes('yakisoba');
};

export function AnalyzerMaster({ savedAnalyzer }: { savedAnalyzer?: SavedAnalyzer }) {
  const [items, setItems] = useState<IfoodProductSearcherItem[]>([]);
  const { savedAnalyzers } = useSavedAnalyzersStore();

  console.log('savedAnalyzers', savedAnalyzers?.[0]?.jsCode);

  const search = async () => {
    const client = new IfoodClient();
    const productSearcher = new IfoodProductSearcher(
      client,
      myMerchantFilter,
      mySushiFilter,
      true,
    );
    const items = await productSearcher.search();
    const sorted = items.sort((a, b) => a.product.unitPrice - b.product.unitPrice);
    setItems(sorted);
  };

  useEffect(() => {search()}, []);

  return <div className={styles.container}>
    <span className={styles.title}><b>iFood Analyzer</b></span>
    <Button onClick={search}>Search</Button>
    <ItemList items={items}></ItemList>
  </div>
}
