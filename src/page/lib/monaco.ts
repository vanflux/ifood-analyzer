import { useMonaco } from "@monaco-editor/react";
import { useEffect, useState } from "react";

let alreadyConfigured = false;

export function useConfiguredMonaco(libSource: string) {
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
    monaco.languages.typescript.typescriptDefaults.addExtraLib(libSource, libUri);
    monaco.editor.createModel(libSource, 'typescript', monaco.Uri.parse(libUri));
  }, [monaco]);

  return monaco;
}
