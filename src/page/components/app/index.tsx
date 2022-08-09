import React, { useEffect } from "react";
import { useWindowsStore } from "../../stores/windows";
import { WindowComponent } from "../window-instance";
import { AnalyzerMaster } from "../analyzer-master";
import { useSavedAnalyzersStore } from "../../stores/saved-analyzers";
import { disposeMonaco } from "../../lib/monaco";
import { useIfoodClientStore } from "../../stores/ifood-client";
import { IfoodClient } from "../../api/ifood";

export function App() {
  const { instances, createWindow } = useWindowsStore();
  const { setIfoodClient } = useIfoodClientStore();

  const { saveAnalyzer } = useSavedAnalyzersStore();
  useEffect(() => {
    setIfoodClient(new IfoodClient());
    saveAnalyzer({ name: 'My Sushi 1', tsCode: `
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
    createWindow('analyzer', 'Analyzer Master', <AnalyzerMaster></AnalyzerMaster>);
  }, []);
  
  useEffect(() => () => { disposeMonaco() }, []);

  return <>
    {instances.map(instance => <WindowComponent key={instance.id} instance={instance}></WindowComponent>)}
  </>
}
