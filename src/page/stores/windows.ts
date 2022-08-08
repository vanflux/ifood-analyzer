import { WindowInstance } from '../types/window-instance';
import create from 'zustand'

interface WindowsStore {
  instances: WindowInstance[];
  create(name: string, title: string, elem: React.ReactElement): void;
  destroy(name: string): void;
};

export const useWindowsStore = create<WindowsStore>((set) => ({
  instances: [],
  create(name: string, title: string, elem: React.ReactElement) {
    set((state) => {
      const alreadyExists = state.instances.findIndex(instance => instance.name === name) >= 0;
      if (alreadyExists) return {};
      return { instances: state.instances.concat([{ name, initialX: state.instances.length * 400, title, elem }]) };
    });
  },
  destroy(name: string) {
    set((state) => {
      return { instances: state.instances.filter(instance => instance.name !== name) };
    });
  },
}));
