import styles from "./styles.module.css";
import React from "react";
import { useCurrentAnalyzeStore } from "../../stores/current-analyze";

export function MerchantList() {
  const { merchants } = useCurrentAnalyzeStore();
  return <div className={styles.container}>
    {
      merchants.length === 0 ? (
        <span style={{ alignSelf: 'center' }}>No merchants found</span>
      ) : (
        <div className={styles.itemList}>
          {
            merchants.map((merchant, i) => (
              <div key={i} className={styles.merchant}>
                {merchant.imageUrl && <img loading="lazy" height={30} src={`https://static-images.ifood.com.br/image/upload/${merchant.imageUrl.replace(':resolution', 't_thumbnail')}`}></img>}
                <span>{merchant.name} ({merchant.userRating}){merchant.isNew ? ' (NEW!)' : ''}</span>
              </div>
            ))
          }
        </div>
      )
    }
  </div>
}
