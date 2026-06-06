import { create } from 'zustand';
import type {
  RainfallStation,
  WaterLevelStation,
  Reservoir,
  PumpStation,
  WarningItem,
  DisposalItem,
  DailyReport,
  SystemConfig,
  ImportedFile,
} from '@/types';
import {
  mockRainfallStations,
  mockWaterLevelStations,
  mockReservoirs,
  mockPumpStations,
  mockWarnings,
  mockDisposals,
  mockReport,
  mockSystemConfig,
} from '@/utils/mockData';

interface AppState {
  rainfallStations: RainfallStation[];
  waterLevelStations: WaterLevelStation[];
  reservoirs: Reservoir[];
  pumpStations: PumpStation[];
  warnings: WarningItem[];
  disposals: DisposalItem[];
  currentReport: DailyReport;
  systemConfig: SystemConfig;
  importedFiles: ImportedFile[];
  selectedBasin: string | null;
  isLoading: boolean;

  setRainfallStations: (stations: RainfallStation[]) => void;
  setWaterLevelStations: (stations: WaterLevelStation[]) => void;
  setReservoirs: (reservoirs: Reservoir[]) => void;
  setPumpStations: (stations: PumpStation[]) => void;
  addWarning: (warning: WarningItem) => void;
  updateWarning: (id: string, updates: Partial<WarningItem>) => void;
  addDisposal: (disposal: DisposalItem) => void;
  updateDisposal: (id: string, updates: Partial<DisposalItem>) => void;
  updateReport: (updates: Partial<DailyReport>) => void;
  addReportVersion: (version: DailyReport['versions'][0]) => void;
  updateSystemConfig: (updates: Partial<SystemConfig>) => void;
  addImportedFile: (file: ImportedFile) => void;
  updateImportedFile: (id: string, updates: Partial<ImportedFile>) => void;
  setSelectedBasin: (basin: string | null) => void;
  loadMockData: () => void;
}

export const useStore = create<AppState>((set) => ({
  rainfallStations: [],
  waterLevelStations: [],
  reservoirs: [],
  pumpStations: [],
  warnings: [],
  disposals: [],
  currentReport: mockReport,
  systemConfig: mockSystemConfig,
  importedFiles: [],
  selectedBasin: null,
  isLoading: false,

  setRainfallStations: (stations) => set({ rainfallStations: stations }),
  setWaterLevelStations: (stations) => set({ waterLevelStations: stations }),
  setReservoirs: (reservoirs) => set({ reservoirs }),
  setPumpStations: (stations) => set({ pumpStations: stations }),

  addWarning: (warning) =>
    set((state) => ({ warnings: [...state.warnings, warning] })),

  updateWarning: (id, updates) =>
    set((state) => ({
      warnings: state.warnings.map((w) =>
        w.id === id ? { ...w, ...updates } : w
      ),
    })),

  addDisposal: (disposal) =>
    set((state) => ({ disposals: [...state.disposals, disposal] })),

  updateDisposal: (id, updates) =>
    set((state) => ({
      disposals: state.disposals.map((d) =>
        d.id === id ? { ...d, ...updates } : d
      ),
    })),

  updateReport: (updates) =>
    set((state) => ({
      currentReport: { ...state.currentReport, ...updates },
    })),

  addReportVersion: (version) =>
    set((state) => ({
      currentReport: {
        ...state.currentReport,
        versions: [...state.currentReport.versions, version],
      },
    })),

  updateSystemConfig: (updates) =>
    set((state) => ({
      systemConfig: { ...state.systemConfig, ...updates },
    })),

  addImportedFile: (file) =>
    set((state) => ({ importedFiles: [...state.importedFiles, file] })),

  updateImportedFile: (id, updates) =>
    set((state) => ({
      importedFiles: state.importedFiles.map((f) =>
        f.id === id ? { ...f, ...updates } : f
      ),
    })),

  setSelectedBasin: (basin) => set({ selectedBasin: basin }),

  loadMockData: () =>
    set({
      rainfallStations: mockRainfallStations,
      waterLevelStations: mockWaterLevelStations,
      reservoirs: mockReservoirs,
      pumpStations: mockPumpStations,
      warnings: mockWarnings,
      disposals: mockDisposals,
    }),
}));
