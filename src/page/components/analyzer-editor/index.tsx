import styles from "./styles.module.css";
import React, { useEffect, useState } from "react";
import { getSemanticDiagnostics,  useConfiguredMonaco } from "../../lib/monaco";
import { useSavedAnalyzersStore } from "../../stores/saved-analyzers";
import { TextInput } from "../text-input";
import { debounce } from "debounce";

export function AnalyzerEditor({ id }: { id: number }) {
  const monaco = useConfiguredMonaco();

  const [editorId] = useState('editor-' + Math.random());
  const { find, save } = useSavedAnalyzersStore();
  const savedAnalyzer = find(id);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (!monaco) return;

    const editor = monaco.editor.create(document.getElementById(editorId)!, {
      value: savedAnalyzer?.tsCode || '',
      language: 'typescript',
      automaticLayout: true,
    });
    
    const onChange = debounce(async () => {
      if (!savedAnalyzer) return;
      const tsCode = editor.getModel()?.getValue() || '';
      save({ ...savedAnalyzer, tsCode });

      console.log('Getting semantic diagnostics...');
      const semanticDiagnostics = await getSemanticDiagnostics(monaco, tsCode);
      const errors = semanticDiagnostics.map(diagnostic => {
        const messageText = diagnostic.messageText.toString();
        const position = diagnostic.start != undefined && editor.getModel()?.getPositionAt(diagnostic.start);
        const positionText = position ? `Line ${position.lineNumber}, col ${position.column}: ` : '';
        return `${positionText}${messageText}`;
      });
      setErrors(errors);
    }, 250);

    editor.getModel()?.onDidChangeContent(onChange);
    onChange();
  }, [monaco]);

  return <div className={styles.container}>
    <TextInput value={savedAnalyzer?.name} onChange={name => savedAnalyzer && save({ ...savedAnalyzer, name })}></TextInput>
    <div className={styles.editor} id={editorId}></div>
    <div className={styles.errors}>
      <span>{errors.join('\n')}</span>
    </div>
  </div>
}
