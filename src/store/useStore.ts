import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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
  Attachment,
  SendRecord,
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
  attachments: Attachment[];
  sendRecords: SendRecord[];
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
  addAttachment: (attachment: Attachment) => void;
  removeAttachment: (id: string) => void;
  addSendRecord: (record: SendRecord) => void;
  setSelectedBasin: (basin: string | null) => void;
  loadMockData: () => void;
  resetAllData: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      rainfallStations: [],
      waterLevelStations: [],
      reservoirs: [],
      pumpStations: [],
      warnings: [],
      disposals: [],
      currentReport: mockReport,
      systemConfig: mockSystemConfig,
      importedFiles: [],
      attachments: [],
      sendRecords: [],
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

      addAttachment: (attachment) =>
        set((state) => ({ attachments: [...state.attachments, attachment] })),

      removeAttachment: (id) =>
        set((state) => ({
          attachments: state.attachments.filter((a) => a.id !== id),
        })),

      addSendRecord: (record) =>
        set((state) => ({ sendRecords: [...state.sendRecords, record] })),

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

      resetAllData: () =>
        set({
          rainfallStations: [],
          waterLevelStations: [],
          reservoirs: [],
          pumpStations: [],
          warnings: [],
          disposals: [],
          currentReport: mockReport,
          importedFiles: [],
          attachments: [],
        }),
    }),
    {
      name: 'flood-report-storage',
      partialize: (state) => ({
        rainfallStations: state.rainfallStations,
        waterLevelStations: state.waterLevelStations,
        reservoirs: state.reservoirs,
        pumpStations: state.pumpStations,
        warnings: state.warnings,
        disposals: state.disposals,
        currentReport: state.currentReport,
        systemConfig: state.systemConfig,
        attachments: state.attachments,
        sendRecords: state.sendRecords,
      }),
    }
  )
);
