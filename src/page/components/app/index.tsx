import React, { useEffect, useState } from "react";
import { useWindowsStore } from "../../stores/windows";
import { WindowComponent } from "../window-instance";
import { AnalyzerMaster } from "../analyzer-master";
import { AnalyzerEditor } from "../analyzer-editor";
import { SavedAnalyzer } from "../../types/saved-analyzer";
import { MerchantList } from "../merchant-list";
import { useSavedAnalyzersStore } from "../../stores/saved-analyzers";

export function App() {
  const { instances, create } = useWindowsStore();
  const { save } = useSavedAnalyzersStore();
  useEffect(() => {
    save({ name: 'My Sushi 1', tsCode: `
function merchantFilter(merchant: Merchant) {
  if (!merchant.available) return false;
  if (merchant.userRating < 4.4) return false;
  if (merchant.deliveryInfo.fee > 0) return false;
  return true;
}

function productFilter(product: Product) {
  let txt = product.details?.toLowerCase() || '';
  txt = txt.indexOf('tag') === -1 ? txt : txt.substring(0, txt.indexOf('tag'));
  txt = txt.indexOf('termos') === -1 ? txt : txt.substring(0, txt.indexOf('termos'));
  txt = txt.indexOf('#') === -1 ? txt : txt.substring(0, txt.indexOf('#'));
  if (txt.includes('skin')) return false;
  if (!txt.includes('niguiri')) return false;
  if (!txt.includes('gunka')) return false;
  if (!txt.includes('uramaki')) return false;
  if (!txt.includes('sashimi')) return false;
  return true;
}
` });
    create('analyzer', 'Analyzer Master', <AnalyzerMaster></AnalyzerMaster>);
  }, []);
  return <>
    {instances.map(instance => <WindowComponent key={instance.id} instance={instance}></WindowComponent>)}
  </>
}
