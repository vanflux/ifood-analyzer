import styles from "./styles.module.css";
import React, { useState, useEffect } from "react";
import { IfoodClient } from "../../ifood/api/client";
import { IfoodProductSearcher, IfoodProductSearcherItem } from "../../ifood/analyzer/product-searcher";
import { IfoodMerchantSearchItem } from "../../ifood/api/operations/merchant-search";
import { ItemList } from "../item-list";

const myMerchantFilter = (merchant: IfoodMerchantSearchItem) => {
  return merchant.available && merchant.currency === 'BRL' && merchant.userRating >= 4.4 && merchant.deliveryInfo.fee === 0;
};

const mySushiFilter = ({ product, merchant }: IfoodProductSearcherItem) => {
  const txt = ((product.description || '') + '\n' + (product.details || '')).toLowerCase();
  return txt.includes('combo') && !txt.includes('skin') && txt.includes('sushi') && !txt.includes('yakisoba');
};

export function Menu() {
  const [items, setItems] = useState<IfoodProductSearcherItem[]>([]);

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
    <button onClick={search}>Search</button>
    <ItemList items={items}></ItemList>
  </div>
}
