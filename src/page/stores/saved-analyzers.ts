import create from 'zustand'
import { SavedAnalyzer } from '../types/saved-analyzer';

interface SavedAnalyzersStore {
  savedAnalyzers: SavedAnalyzer[];
  save(savedAnalyzer: SavedAnalyzer): void;
  remove(name: string): void;
};

export const useSavedAnalyzersStore = create<SavedAnalyzersStore>((set) => ({
  savedAnalyzers: [],
  save(savedAnalyzer: SavedAnalyzer) {
    set((state) => {
      const index = state.savedAnalyzers.findIndex(_savedAnalyzer => _savedAnalyzer.name === savedAnalyzer.name);
      if (index >= 0) {
        return { savedAnalyzers: [...state.savedAnalyzers.slice(0, index), savedAnalyzer, ...state.savedAnalyzers.slice(index)] };
      } else {
        return { savedAnalyzers: state.savedAnalyzers.concat([savedAnalyzer]) };
      }
    });
  },
  remove(name: string) {
    set((state) => {
      return { savedAnalyzers: state.savedAnalyzers.filter(savedAnalyzer => savedAnalyzer.name !== name) };
    });
  },
}));
