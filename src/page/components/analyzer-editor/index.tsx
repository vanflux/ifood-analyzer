import styles from "./styles.module.css";
import React, { useEffect, useState } from "react";
import { createEditor } from "../../lib/monaco";
import { useSavedAnalyzersStore } from "../../stores/saved-analyzers";
import { TextInput } from "../text-input";
import { debounce } from "debounce";
import { editor } from "monaco-editor";

export function AnalyzerEditor({ id }: { id: number }) {
  const [editorId] = useState('editor-' + Math.random());
  const { find, save } = useSavedAnalyzersStore();
  const savedAnalyzer = find(id);

  useEffect(() => {
    let editor: editor.IStandaloneCodeEditor;
    const run = async () => {
      editor = await createEditor(document.getElementById(editorId)!, {
        value: savedAnalyzer?.tsCode || '',
        language: 'typescript',
        automaticLayout: true,
        minimap: { enabled: false },
      });
      
      const onChange = debounce(async () => {
        if (!savedAnalyzer) return;
        const tsCode = editor.getModel()?.getValue() || '';
        save({ ...savedAnalyzer, tsCode });
      }, 250);
  
      editor.getModel()?.onDidChangeContent(onChange);
      onChange();
    };
    run();
    return () => editor?.getModel()?.dispose();
  }, []);

  return <div className={styles.container}>
    <TextInput value={savedAnalyzer?.name} onChange={name => savedAnalyzer && save({ ...savedAnalyzer, name })}></TextInput>
    <div className={styles.editor} id={editorId}></div>
  </div>
}
