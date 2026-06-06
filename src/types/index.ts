export interface RainfallStation {
  id: string;
  name: string;
  basin: string;
  rainfall: number;
  oneHourRain: number;
  warningLevel: 'normal' | 'attention' | 'warning' | 'emergency';
  updateTime: string;
}

export interface WaterLevelStation {
  id: string;
  name: string;
  basin: string;
  currentLevel: number;
  warningLevel: number;
  isOverWarning: boolean;
  trend: 'rising' | 'falling' | 'stable';
  updateTime: string;
}

export interface Reservoir {
  id: string;
  name: string;
  basin: string;
  isDangerous: boolean;
  currentLevel: number;
  maxLevel: number;
  storage: number;
  outflow: number;
  updateTime: string;
}

export interface PumpStation {
  id: string;
  name: string;
  basin: string;
  runningCount: number;
  totalCapacity: number;
  drainageVolume: number;
  updateTime: string;
}

export type WarningType = 'rainfall' | 'waterLevel' | 'reservoir' | 'other';
export type WarningLevel = 'blue' | 'yellow' | 'orange' | 'red';

export interface WarningItem {
  id: string;
  type: WarningType;
  level: WarningLevel;
  title: string;
  description: string;
  location: string;
  createTime: string;
  isHandled: boolean;
  handleTime?: string;
}

export type DisposalStatus = 'pending' | 'processing' | 'completed' | 'delayed';

export interface DisposalItem {
  id: string;
  title: string;
  description: string;
  relatedWarningId?: string;
  personInCharge: string;
  status: DisposalStatus;
  progress: number;
  createTime: string;
  deadline: string;
  remarks: string[];
}

export type ReportStatus = 'draft' | 'reviewing' | 'finalized' | 'archived';

export interface ReportVersion {
  version: number;
  content: string;
  createTime: string;
  creator: string;
  changeLog: string;
}

export interface DailyReport {
  id: string;
  date: string;
  title: string;
  content: string;
  leaderComments: string;
  versions: ReportVersion[];
  status: ReportStatus;
  createTime: string;
  updateTime: string;
  creator: string;
}

export interface SystemConfig {
  basins: string[];
  rainfallWarning: {
    attention: number;
    warning: number;
    emergency: number;
  };
  sensitiveWords: string[];
  reminderTime: string;
}

export interface ImportedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadTime: string;
  status: 'uploading' | 'success' | 'error';
  data?: any[];
}

export interface BasinSummary {
  basin: string;
  avgRainfall: number;
  maxRainfall: number;
  stationCount: number;
  overWarningCount: number;
  dangerousReservoirCount: number;
  drainageVolume: number;
}
