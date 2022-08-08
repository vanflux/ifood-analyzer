# iFood Analyzer (in early development)

Browser extension to search for iFood items throught multiple merchants at same time. This is mostly for fun, I have no intention of maintaining this project forever.

This project uses [vf-ext](https://github.com/vanflux/vf-ext) to create browser extensions. If you want to create extensions like this, take a look.

## Usage

- Oh, wait a bit, in few days I will start publishing the extension builds...

![](./docs/images/screenshoot.png)

## Usage (development)

- Clone repo
- Run `npm i`
- Run `npm start` (or, for firefox, `npm start firefox`)
- Load the extension in development mode on your browser (the extension dir is `build/dev`)

## State

What the extension does at the moment:
- Fetches the 100 first merchants related to a term like "sushi"
- Apply filters to discart some merchants (configured by the user)
- Fetches the catalog of each
- Apply filters to discart products (configured by the user)
- Show the result on a window (merchants + items)

## Goal

- [In progress] Provide some API or UI for the user configure filters to merch & products and get the final cart.
