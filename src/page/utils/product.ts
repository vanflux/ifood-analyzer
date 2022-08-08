import { IfoodItem } from "../stores/current-analyze";

export function totalPrice(item: IfoodItem) {
  return item.product.unitPrice + (item.merchant.deliveryInfo.fee / 100);
}
