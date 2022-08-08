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
import { getSemanticDiagnostics, transpile, useConfiguredMonaco } from "../../lib/monaco";

export function AnalyzerMaster() {
  const [ term, setTerm ] = useState('');
  const { savedAnalyzers } = useSavedAnalyzersStore();
  const [ savedAnalyzerId, setSavedAnalyzerId ] = useState<number>();
  const { create } = useWindowsStore();
  const [ ifoodClient, setIfoodClient ] = useState<IfoodClient>();
  const { merchants, filteredMerchants, items, searchMerchs, searchItems } = useCurrentAnalyzeStore();
  const monaco = useConfiguredMonaco();

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
    if (!monaco) return;
    if (savedAnalyzerId === undefined) return;
    const savedAnalyzer = savedAnalyzers.find(savedAnalyzer => savedAnalyzer.id == savedAnalyzerId);
    if (!savedAnalyzer) return;
    const tsCode = savedAnalyzer.tsCode;
    if (!tsCode) return;
    console.log('Getting semantic diagnostics...');
    const semanticDiagnostics = await getSemanticDiagnostics(monaco, tsCode);
    if (semanticDiagnostics.length > 0) {
      console.error('Semantic errors found:');
      console.error(semanticDiagnostics.map(diagnostic => diagnostic.messageText));
      return;
    }
    console.log('Transpiling ts to js code...');
    const jsCode = await transpile(monaco, tsCode);
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

  useEffect(() => setIfoodClient(new IfoodClient()), []);
  useEffect(() => () => monaco?.editor.getModels().forEach(model => model.dispose()), [monaco]);

  return <div className={styles.container}>
    <span className={styles.title}><b>iFood Analyzer</b></span>
    <div className={styles.row}>
      <TextInput placeholder={'Term'} width={150} value={term} onChange={setTerm}></TextInput>
      <Button onClick={searchForMerchs}>Search Merchs</Button>
    </div>
    <span>Found {merchants.length} merchants!</span>
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
    <span>Found {items.length} items on {filteredMerchants.length} merchants!</span>
  </div>
}
