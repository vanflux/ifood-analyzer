import create from 'zustand'
import { SavedAnalyzer } from '../types/saved-analyzer';
import { PartialBy } from '../types/utils';

interface SavedAnalyzersStore {
  savedAnalyzers: SavedAnalyzer[];
  findAnalyzer(id: number): SavedAnalyzer | undefined;
  saveAnalyzer(savedAnalyzer: PartialBy<SavedAnalyzer, 'id'>): number;
  removeAnalyzer(name: number): void;
};

export const useSavedAnalyzersStore = create<SavedAnalyzersStore>((set, get) => ({
  savedAnalyzers: [],
  findAnalyzer(id: number) {
    return get().savedAnalyzers.find(x => x.id === id);
  },
  saveAnalyzer(savedAnalyzer: PartialBy<SavedAnalyzer, 'id'>) {
    const { savedAnalyzers } = get();
    const index = savedAnalyzers.findIndex(_savedAnalyzer => _savedAnalyzer.id === savedAnalyzer.id);
    if (index >= 0) { // Update existent
      set(() => ({ savedAnalyzers: [...savedAnalyzers.slice(0, index), savedAnalyzer as SavedAnalyzer, ...savedAnalyzers.slice(index + 1)] }));
      return savedAnalyzer.id!;
    } else { // Add new
      const allIds = get().savedAnalyzers.map(savedAnalyzer => savedAnalyzer.id);
      const nextId = Math.max(-1, ...allIds) + 1;
      set(() => ({ savedAnalyzers: savedAnalyzers.concat([{ ...savedAnalyzer, id: nextId }]) }));
      return nextId;
    }
  },
  removeAnalyzer(id: number) {
    set((state) => ({ savedAnalyzers: state.savedAnalyzers.filter(savedAnalyzer => savedAnalyzer.id !== id) }));
  },
}));
