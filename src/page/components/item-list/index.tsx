import styles from "./styles.module.css";
import React from "react";
import { IfoodProductSearcherItem } from "../../api/ifood";

export function ItemList({ items }: { items: IfoodProductSearcherItem[] }) {
  return <div className={styles.container}>
    {
      items.length === 0 ? (
        <span style={{ alignSelf: 'center' }}>No items</span>
      ) : (
        <div className={styles.itemList}>
          {
            items.map((item, i) => (
              <div key={i} className={styles.item}>
                <div className={styles.itemProduct}>
                  <div className={styles.merchantTitle}>
                    {item.merchant.imageUrl && <img loading="lazy" height={30} src={`https://static-images.ifood.com.br/image/upload/${item.merchant.imageUrl.replace(':resolution', 't_thumbnail')}`}></img>}
                    <span>{item.merchant.name} ({item.merchant.userRating}){item.merchant.isNew ? ' (NEW!)' : ''}</span>
                  </div>
                  <span className={styles.productName}><b>R$ {item.product.unitPrice}</b> - {item.merchant.name}</span>
                  <span className={styles.productDescription}>{item.product.description}</span>
                  <span className={styles.productDetails}>{item.product.details?.replace(/[,;\+]|( e )/g, '\n')}</span>
                </div>
                {item.product.logoUrl && <img loading="lazy" height={100} src={`https://static-images.ifood.com.br/image/upload/t_low/pratos/${item.product.logoUrl}`}></img>}
              </div>
            ))
          }
        </div>
      )
    }
  </div>
}
