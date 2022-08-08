import styles from "./styles.module.css";
import React, { useState, useEffect } from "react";
import { IfoodClient } from "../../api/ifood";
import { Button } from "../button";
import { useSavedAnalyzersStore } from "../../stores/saved-analyzers";
import safeEval from "safe-eval";
import { TextInput } from "../text-input";
import { useCurrentAnalyzeStore } from "../../stores/current-analyze";
import { MerchantList } from "../merchant-list";
import { useWindowsStore } from "../../stores/windows";
import { SelectInput } from "../select-input";
import { ItemList } from "../item-list";
import { disposeMonaco, transpile } from "../../lib/monaco";
import { AnalyzerEditor } from "../analyzer-editor";

export function AnalyzerMaster() {
  const [ term, setTerm ] = useState('');
  const { save, savedAnalyzers } = useSavedAnalyzersStore();
  const [ savedAnalyzerId, setSavedAnalyzerId ] = useState<number>();
  const [ editSavedAnalyzerId, setEditSavedAnalyzerId ] = useState<number>();
  const { create, destroy } = useWindowsStore();
  const [ ifoodClient, setIfoodClient ] = useState<IfoodClient>();
  const { merchants, filteredMerchants, items, searchMerchs, searchItems } = useCurrentAnalyzeStore();

  const searchForMerchs = async () => {
    if (!ifoodClient) return alert('Ifood client not defined!');
    if (!term) return alert('Term is required!');
    const merchants = await searchMerchs(ifoodClient, term);
    console.log('Found merchants', merchants);
    create('merch_list', 'Analyzer Merchants', <MerchantList></MerchantList>);
  };

  const searchForItems = async () => {
    if (!ifoodClient) return alert('Ifood client not defined!');
    const filters = await prepareFilters();
    if (!filters) return alert('Filters are required!');
    const items = await searchItems(ifoodClient, filters.merchantFilter, filters.productFilter);
    console.log('Found items', items);
    create('item_list', 'Analyzer Items', <ItemList></ItemList>);
  };

  const prepareFilters = async () => {
    if (savedAnalyzerId === undefined) return;
    const savedAnalyzer = savedAnalyzers.find(savedAnalyzer => savedAnalyzer.id == savedAnalyzerId);
    if (!savedAnalyzer) return;
    const tsCode = savedAnalyzer.tsCode;
    if (!tsCode) return;
    console.log('Transpiling ts to js code...');
    const jsCode = await transpile(tsCode);
    console.log('Building filters...');
    try {
      const { merchantFilter, productFilter } = safeEval(`(()=>{${jsCode};return {merchantFilter,productFilter}})()`);
      console.log('Filters built successfully!');
      return { merchantFilter, productFilter };
    } catch (exc) {
      console.error('Build filter error:');
      console.error(exc);
    }
  };

  const editSavedAnalyzer = () => {
    if (editSavedAnalyzerId === undefined) return alert('No analyzers selected');
    destroy('analyzer_editor');
    create('analyzer_editor', 'Analyzer Editor', <AnalyzerEditor id={editSavedAnalyzerId}></AnalyzerEditor>);
  };

  const addSavedAnalyzer = () => {
    const randomNum = Math.floor(Math.random() * 100000000);
    const id = save({ name: `Untitled-${randomNum}`, tsCode: `
function merchantFilter(merchant: Merchant) {
  // Merchant filter here
  return Math.random() > 0.9;
}

function productFilter(product: Product) {
  // Product filter here
  return Math.random() > 0.9;
}    
`   });
    setEditSavedAnalyzerId(id);
  };

  useEffect(() => setIfoodClient(new IfoodClient()), []);
  useEffect(() => () => { disposeMonaco() }, []);

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
                key: savedAnalyzer.id,
                value: savedAnalyzer,
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
              key: savedAnalyzer.id,
              value: savedAnalyzer,
              elem: savedAnalyzer.name,
            }))
          )}
          width={140}
          value={editSavedAnalyzerId}
          onChange={setEditSavedAnalyzerId}
        ></SelectInput>
        <Button onClick={editSavedAnalyzer}>Edit</Button>
        <Button onClick={addSavedAnalyzer}>Add</Button>
      </div>
    </div>
  </div>
}
