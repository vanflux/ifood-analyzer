import create from 'zustand'
import { IfoodClient } from '../api/ifood';

interface CurrentAnalyzerStore {
  ifoodClient: IfoodClient;
  setIfoodClient(client: IfoodClient): void;
};

export const useIfoodClientStore = create<CurrentAnalyzerStore>((set) => ({
  ifoodClient: undefined!,
  setIfoodClient(ifoodClient: IfoodClient) {
    set(() => ({ ifoodClient }));
  },
}));
