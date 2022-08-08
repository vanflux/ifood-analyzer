import loader, { Monaco } from "@monaco-editor/loader";
import { editor, languages } from "monaco-editor";

let monaco: Monaco | undefined;
let tsWorkerModel: editor.IModel;
let tsWorker: languages.typescript.TypeScriptWorker;

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

export async function getMonaco() {
  if (!monaco) {
    monaco = await loader.init();

    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
    });
  
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.Latest,
      allowNonTsExtensions: true,
    });

    const libUri = 'ts:filename/lib.d.ts';
    monaco.languages.typescript.typescriptDefaults.addExtraLib(lib, libUri);
    monaco.editor.createModel(lib, 'typescript', monaco.Uri.parse(libUri));
  }
  return monaco!;
}

export async function getTsWorker() {
  const monaco = await getMonaco();
  if (!tsWorker) {
    console.log('Creating transpiler...');
    tsWorkerModel = monaco.editor.createModel('', 'typescript');
    const getWorker = await monaco.languages.typescript.getTypeScriptWorker();
    tsWorker = await getWorker(tsWorkerModel.uri);
  }
  return tsWorker;
}

export async function transpile(tsCode: string) {
  if (!tsWorker) await getTsWorker();
  tsWorkerModel.setValue(tsCode);
  const output = await tsWorker.getEmitOutput(tsWorkerModel.uri.toString());
  // Monaco model namespaces are NOT isolated...
  // we need to clear the code from the worker model
  // if not, semantic "duplicated function" errors will appear on editor models
  tsWorkerModel.setValue('');
  const jsCode = output.outputFiles[0].text;
  return jsCode;
}

export async function disposeMonaco() {
  const monaco = await getMonaco();
  tsWorkerModel?.dispose();
  monaco.editor.getModels().forEach(model => model.dispose());
}

export async function createEditor(
  elem: HTMLElement,
  options: editor.IStandaloneEditorConstructionOptions | undefined,
  override?: editor.IEditorOverrideServices | undefined
) {
  const monaco = await getMonaco();
  return monaco.editor.create(elem, options, override);
}
