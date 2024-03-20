import { create } from "zustand";

export const useModelStore = create((set) => ({
  models: [],
  setModels: (e) => set(() => ({ models: e })),
}));

export const useSpaceStore = create((set) => ({
  sizeX: 4,
  setSizeX: (e) => set(() => ({ sizeX: e })),

  sizeY: 2.5,
  setSizeY: (e) => set(() => ({ sizeY: e })),

  sizeZ: 6,
  setSizeZ: (e) => set(() => ({ sizeZ: e })),

  wallColor: "#ddd",
  setWallColor: (e) => set(() => ({ wallColor: e })),

  floorColor: "/images/floor_1.png",
  setFloorColor: (e) => set(() => ({ floorColor: e })),

  controls: false,
  setControls: (e) => set(() => ({ controls: e })),
}));
