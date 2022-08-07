# iFood Analyzer (in early development)

Browser extension to search for good and cheap iFood items.

This project uses [vf-ext](https://github.com/vanflux/vf-ext) to create browser extensions. If you want to create extensions like this, take a look.

## Usage

- Oh, wait a bit

## Usage (development)

- Clone repo
- Run `npm i`
- Run `npm start` (or, for firefox, `npm start firefox`)
- Load the extension in development mode on your browser (the extension dir is `build/dev`)

## State

What the extension does at the moment (hardcoded):
- Fetches the 100 first merchants related to a keyword like "sushi"
- Apply filters to discart some merchants
- Fetches the catalog of each
- Apply filters to discart products
- Show the result on a ugly menu.

If you go to menu code you will see the hardcoded filter functions:

Merchant filter:
```ts
const myMerchantFilter = (merchant: IfoodMerchantSearchItem) => {
  return merchant.userRating >= 4.4 && merchant.deliveryInfo.fee === 0;
};
```

Product filter:
```ts
const mySushiFilter = ({ product, merchant }: IfoodProductSearcherItem) => {
  const txt = ((product.description || '') + '\n' + (product.details || '')).toLowerCase();
  return txt.includes('combo') && !txt.includes('skin') && txt.includes('sushi') && !txt.includes('yakisoba');
};
```

## Goal

Provide some API or UI for the user configure filters to merch & products and get the final cart.
