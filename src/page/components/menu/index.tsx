import styles from "./styles.module.css";
import React, { useState } from "react";
import { IfoodClient } from "../../ifood/api/client";
import { IfoodProductSearcher, IfoodProductSearcherItem } from "../../ifood/analyzer/product-searcher";
import { IfoodMerchantSearchItem } from "../../ifood/api/operations/merchant-search";

const myMerchantFilter = (merchant: IfoodMerchantSearchItem) => {
  return merchant.userRating >= 4.4 && merchant.deliveryInfo.fee === 0;
};

const mySushiFilter = ({ product, merchant }: IfoodProductSearcherItem) => {
  const txt = ((product.description || '') + '\n' + (product.details || '')).toLowerCase();
  return txt.includes('combo') && !txt.includes('skin') && txt.includes('sushi') && !txt.includes('yakisoba');
};

export function Menu() {
  const [items, setItems] = useState<IfoodProductSearcherItem[]>([]);

  return <div className={styles.container}>
    <p className={styles.title}>iFood Analyzer (in early dev)</p>
    <button onClick={async () => {
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
    }}>Search</button>
    <div className={styles.itemList}>
      {items.map((item, i) => (
        <div key={i} className={styles.item}>
          <div>R$ {item.product.unitPrice}</div>
          <div>{item.merchant.name}</div>
          <div>{item.product.description}</div>
          <div className={styles.divider}></div>
          <div>{item.product.details?.replace(/[,;\+]|( e )/g, '\n')}</div>
        </div>
      ))}
    </div>
  </div>
}
