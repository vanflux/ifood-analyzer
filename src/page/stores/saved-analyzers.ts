import create from 'zustand'
import { SavedAnalyzer } from '../types/saved-analyzer';

interface SavedAnalyzersStore {
  savedAnalyzers: SavedAnalyzer[];
  find(id: number): SavedAnalyzer | undefined;
  save(savedAnalyzer: SavedAnalyzer): void;
  remove(name: number): void;
};

export const useSavedAnalyzersStore = create<SavedAnalyzersStore>((set, getState) => ({
  savedAnalyzers: [],
  find(id: number) {
    return getState().savedAnalyzers.find(x => x.id === id);
  },
  save(savedAnalyzer: SavedAnalyzer) {
    set((state) => {
      const index = state.savedAnalyzers.findIndex(_savedAnalyzer => _savedAnalyzer.id === savedAnalyzer.id);
      if (index >= 0) {
        return { savedAnalyzers: [...state.savedAnalyzers.slice(0, index), savedAnalyzer, ...state.savedAnalyzers.slice(index + 1)] };
      } else {
        return { savedAnalyzers: state.savedAnalyzers.concat([savedAnalyzer]) };
      }
    });
  },
  remove(id: number) {
    set((state) => {
      return { savedAnalyzers: state.savedAnalyzers.filter(savedAnalyzer => savedAnalyzer.id !== id) };
    });
  },
}));
