import styles from "./styles.module.css";
import React, { useState } from "react";
import { Button } from "../button";
import { useSavedAnalyzersStore } from "../../stores/saved-analyzers";
import { TextInput } from "../text-input";
import { useCurrentAnalyzeStore } from "../../stores/current-analyze";
import { MerchantList } from "../merchant-list";
import { useWindowsStore } from "../../stores/windows";
import { SelectInput } from "../select-input";
import { ItemList } from "../item-list";
import { AnalyzerEditor } from "../analyzer-editor";
import { useIfoodClientStore } from "../../stores/ifood-client";

export function AnalyzerMaster() {
  const [ term, setTerm ] = useState('');
  const { findAnalyzer, saveAnalyzer, savedAnalyzers } = useSavedAnalyzersStore();
  const [ savedAnalyzerId, setSavedAnalyzerId ] = useState<number>();
  const [ editedSavedAnalyzerId, setEditedSavedAnalyzerId ] = useState<number>();
  const { createWindow, destroyWindow } = useWindowsStore();
  const { merchants, filteredMerchants, items, searchMerchs, searchItems, buildFilters } = useCurrentAnalyzeStore();
  const { ifoodClient } = useIfoodClientStore();

  const searchForMerchs = async () => {
    if (!term) return alert('Term is required!');
    const merchants = await searchMerchs(ifoodClient, term);
    console.log('Found merchants', merchants);
    createWindow('merch_list', 'Analyzer Merchants', <MerchantList></MerchantList>);
  };

  const searchForItems = async () => {
    if (savedAnalyzerId == undefined) return alert('Analyzer is required!');
    const savedAnalyzer = findAnalyzer(savedAnalyzerId);
    if (!savedAnalyzer) return alert('Analyzer not found!');
    const { merchantFilter, productFilter } = await buildFilters(savedAnalyzer);
    if (!merchantFilter || !productFilter) return alert('Filters are required!');
    const items = await searchItems(ifoodClient);
    console.log('Found items', items);
    createWindow('item_list', 'Analyzer Items', <ItemList></ItemList>);
  };

  const editSavedAnalyzer = () => {
    if (editedSavedAnalyzerId === undefined) return alert('No analyzers selected');
    destroyWindow('analyzer_editor');
    createWindow('analyzer_editor', 'Analyzer Editor', <AnalyzerEditor id={editedSavedAnalyzerId}></AnalyzerEditor>);
  };

  const addSavedAnalyzer = () => {
    const randomNum = Math.floor(Math.random() * 100000000);
    const id = saveAnalyzer({ name: `Untitled-${randomNum}`, tsCode: `
function merchantFilter(merchant: Merchant) {
  // Merchant filter here
  return Math.random() > 0.9;
}

function productFilter(product: Product) {
  // Product filter here
  return Math.random() > 0.9;
}    
`   });
    setEditedSavedAnalyzerId(id);
  };

  return <div className={styles.container}>
    <span className={styles.title}><b>iFood Analyzer</b></span>
    <div className={styles.group}>
      <span>Merchants search ({merchants.length} found)</span>
      <div className={styles.row}>
        <TextInput placeholder={'Term (sushi, ...)'} width={150} value={term} onChange={setTerm}></TextInput>
        <Button onClick={searchForMerchs}>Search Merchs</Button>
      </div>
    </div>
    {merchants.length > 0 && (
      <div className={styles.group}>
        <span>Items search ({items.length} found on {filteredMerchants.length} merchs)</span>
        <div className={styles.row}>
          <SelectInput
            options={(
              savedAnalyzers.map(savedAnalyzer => ({
                value: savedAnalyzer.id,
                elem: savedAnalyzer.name,
              }))
            )}
            width={140}
            value={savedAnalyzerId}
            onChange={setSavedAnalyzerId}
          ></SelectInput>
          <Button onClick={searchForItems}>Search Items</Button>
        </div>
      </div>
    )}
    <div className={styles.group}>
      <span>Analyzers</span>
      <div className={styles.row}>
        <SelectInput
          options={(
            savedAnalyzers.map(savedAnalyzer => ({
              value: savedAnalyzer.id,
              elem: savedAnalyzer.name,
            }))
          )}
          width={140}
          value={editedSavedAnalyzerId}
          onChange={setEditedSavedAnalyzerId}
        ></SelectInput>
        <Button onClick={editSavedAnalyzer}>Edit</Button>
        <Button onClick={addSavedAnalyzer}>Add</Button>
      </div>
    </div>
  </div>
}
