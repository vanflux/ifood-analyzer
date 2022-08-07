import React, { useEffect, useState } from "react";
import { useWindowsStore } from "../../stores/windows";
import { WindowComponent } from "../window-instance";
import { AnalyzerMaster } from "../analyzer-master";
import { AnalyzerEditor } from "../analyzer-editor";
import { SavedAnalyzer } from "../../types/saved-analyzer";

export function App() {
  const { instances, create } = useWindowsStore();
  const [ savedAnalyzer, setSavedAnalyzer ] = useState<SavedAnalyzer>();
  useEffect(() => {
    create('analyzer', 'Analyzer Master', <AnalyzerMaster></AnalyzerMaster>);
    create('analyzer_editor', 'Analyzer Editor', <AnalyzerEditor savedAnalyzer={savedAnalyzer} onSave={setSavedAnalyzer}></AnalyzerEditor>);
  }, []);
  return <>
    {instances.map(instance => <WindowComponent key={instance.name} instance={instance}></WindowComponent>)}
  </>
}
