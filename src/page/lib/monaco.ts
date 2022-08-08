import { Monaco, useMonaco } from "@monaco-editor/react";
import { useEffect } from "react";
import monaco from "monaco-editor";

let alreadyConfigured = false;

let tsWorkerModel: monaco.editor.IModel;
let tsWorker: monaco.languages.typescript.TypeScriptWorker;

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

export function useConfiguredMonaco() {
  const monaco = useMonaco();

  useEffect(() => {
    if (!monaco) return;
    if (alreadyConfigured) return;
    alreadyConfigured = true;

    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: false,
    });
  
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.Latest,
      allowNonTsExtensions: true,
    });

    const libUri = 'ts:filename/lib.d.ts';
    monaco.languages.typescript.typescriptDefaults.addExtraLib(lib, libUri);
    monaco.editor.createModel(lib, 'typescript', monaco.Uri.parse(libUri));
  }, [monaco]);

  return monaco;
}

export async function getTsWorker(monaco: Monaco) {
  if (!tsWorker) {
    console.log('Creating transpiler...');
    tsWorkerModel = monaco.editor.createModel('', 'typescript');
    const getWorker = await monaco.languages.typescript.getTypeScriptWorker();
    tsWorker = await getWorker(tsWorkerModel.uri);
  }
  return tsWorker;
}

export async function transpile(monaco: Monaco, tsCode: string) {
  if (!tsWorker) await getTsWorker(monaco);
  tsWorkerModel.setValue(tsCode);
  const output = await tsWorker.getEmitOutput(tsWorkerModel.uri.toString());
  const jsCode = output.outputFiles[0].text;
  return jsCode;
}

export async function getSemanticDiagnostics(monaco: Monaco, tsCode: string) {
  if (!tsWorker) await getTsWorker(monaco);
  tsWorkerModel.setValue(tsCode);
  const semanticDiagnostics = await tsWorker.getSemanticDiagnostics(tsWorkerModel.uri.toString());
  return semanticDiagnostics;
}
