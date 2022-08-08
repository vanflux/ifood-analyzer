import create from 'zustand'
import { SavedAnalyzer } from '../types/saved-analyzer';
import { PartialBy } from '../types/utils';

interface SavedAnalyzersStore {
  savedAnalyzers: SavedAnalyzer[];
  find(id: number): SavedAnalyzer | undefined;
  save(savedAnalyzer: PartialBy<SavedAnalyzer, 'id'>): number;
  remove(name: number): void;
};

export const useSavedAnalyzersStore = create<SavedAnalyzersStore>((set, get) => ({
  savedAnalyzers: [],
  find(id: number) {
    return get().savedAnalyzers.find(x => x.id === id);
  },
  save(savedAnalyzer: PartialBy<SavedAnalyzer, 'id'>): number {
    let id = 0;
    set((state) => {
      const index = state.savedAnalyzers.findIndex(_savedAnalyzer => _savedAnalyzer.id === savedAnalyzer.id);
      if (index >= 0) {
        id = savedAnalyzer.id!;
        return { savedAnalyzers: [...state.savedAnalyzers.slice(0, index), savedAnalyzer as SavedAnalyzer, ...state.savedAnalyzers.slice(index + 1)] };
      } else {
        const allIds = get().savedAnalyzers.map(savedAnalyzer => savedAnalyzer.id);
        const nextId = Math.max(-1, ...allIds) + 1;
        id = nextId;
        return { savedAnalyzers: state.savedAnalyzers.concat([{ ...savedAnalyzer, id: nextId }]) };
      }
    });
    return id;
  },
  remove(id: number) {
    set((state) => {
      return { savedAnalyzers: state.savedAnalyzers.filter(savedAnalyzer => savedAnalyzer.id !== id) };
    });
  },
}));
