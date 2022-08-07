import styles from "./styles.module.css";
import React, { useEffect, useState } from "react";
import { useConfiguredMonaco } from "../../lib/monaco";
import { editor, languages } from 'monaco-editor';
import { Button } from "../button";
import { SavedAnalyzer } from "../../types/saved-analyzer";
import { useSavedAnalyzersStore } from "../../stores/saved-analyzers";

const lib = `
interface Merchant {
  action: string;
  available: boolean;
  contextMessage?: {
    icon: string;
    message: string;
    type: string;
  };
  currency: string;
  deliveryInfo: {
    deliveryMode?: string;
    fee: number;
    timeMaxMinutes?: number;
    timeMinMinutes?: number;
    type: string;
  };
  distance: number;
  id: string;
  imageUrl: string;
  isFavorite: boolean;
  isIfoodDelivery: boolean;
  isNew: boolean;
  isSuperRestaurant: boolean;
  mainCategory: string;
  name: string;
  supportsTracking: boolean;
  userRating: number;
}

interface Product {
  id: string;
  code: string;
  description: string;
  logoUrl?: string;
  needChoices: boolean;
  unitPrice: number;
  unitMinPrice: number;
  sellingOption?: {
    minimum: number;
    incremental: number;
    availableUnits: string[];
  };
  productTags?: {
    group: string;
    tags: string[];
  }[];
  productInfo?: {
    id: string;
    quantity: number;
    unit: string;
  };
	details?: string;
}
`;

const initialTsCode = `
function merchantFilter(merchant: Merchant) {
  return merchant.userRating >= 4.4;
}

function productFilter(product: Product) {
  return product.details.toLowerCase().includes('temaki salmão');
}
`;

export function AnalyzerEditor({ savedAnalyzer, onSave }: { savedAnalyzer?: SavedAnalyzer, onSave: (savedAnalyzer: SavedAnalyzer) => any }) {
  const monaco = useConfiguredMonaco(lib);

  const [editor, setEditor] = useState<editor.IStandaloneCodeEditor>();
  const [tsProxy, setTsProxy] = useState<languages.typescript.TypeScriptWorker>();
  const [id] = useState('editor-' + Math.random());
  const { save: saveAnalyzer } = useSavedAnalyzersStore();

  useEffect(() => {
    if (!monaco) return;

    const editor = monaco.editor.create(document.getElementById(id)!, {
      value: savedAnalyzer?.tsCode || initialTsCode,
      language: 'typescript',
      automaticLayout: true,
    });
    setEditor(editor);

    monaco.languages.typescript.getTypeScriptWorker().then(worker => {
      worker(editor.getModel()!.uri).then(setTsProxy);
    });

    return () => monaco.editor.getModels().forEach(model => model.dispose());
  }, [monaco]);

  const save = () => {
    if (!tsProxy || !editor) return;
    tsProxy.getEmitOutput(editor.getModel()!.uri.toString()).then((r) => {
      const name = savedAnalyzer?.name || 'Unnamed';
      const tsCode = editor.getValue();
      const jsCode = r.outputFiles[0].text;
      const newSavedAnalyzer = { name, tsCode, jsCode };
      saveAnalyzer(newSavedAnalyzer);
      onSave(newSavedAnalyzer);
    });
  };

  return <div className={styles.container}>
    <Button onClick={save} type='secondary'>Save</Button>
    <div className={styles.editor} id={id}></div>
  </div>
}
