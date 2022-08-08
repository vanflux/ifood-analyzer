import { WindowInstance } from '../types/window-instance';
import create from 'zustand'
import { ReactElement } from 'react';

interface WindowsStore {
  instances: WindowInstance[];
  nextId: number;
  create(name: string, title: string, elem: React.ReactElement): void;
  destroy(name: string): void;
};

export const useWindowsStore = create<WindowsStore>((set) => ({
  instances: [],
  nextId: 0,
  create(name: string, title: string, elem: React.ReactElement) {
    set((state) => {
      const alreadyExists = state.instances.findIndex(instance => instance.name === name) >= 0;
      if (alreadyExists) return {};
      const id = state.nextId++;
      const initialX = 10 + state.instances.length * 40;
      const initialY = 10 + state.instances.length * 40;
      return { instances: state.instances.concat([{ id, name, initialX, initialY, title, elem }]) };
    });
  },
  destroy(name: string) {
    set((state) => {
      return { instances: state.instances.filter(instance => instance.name !== name) };
    });
  },
}));
