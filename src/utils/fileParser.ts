import * as XLSX from 'xlsx';
import type { RainfallStation, WaterLevelStation, Reservoir, PumpStation } from '@/types';

export interface ParseResult<T> {
  success: boolean;
  data: T[];
  errors: string[];
}

export async function parseExcelFile(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);
        resolve(jsonData);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

export async function parseCSVFile(file: File): Promise<any[]> {
  return parseExcelFile(file);
}

export function mapToRainfallStations(data: any[], basinMap?: Record<string, string>): ParseResult<RainfallStation> {
  const errors: string[] = [];
  const stations: RainfallStation[] = [];

  const fieldMap: Record<string, string> = {
    '站名': 'name',
    '站点名称': 'name',
    'name': 'name',
    '流域': 'basin',
    'basin': 'basin',
    '雨量': 'rainfall',
    '累计雨量': 'rainfall',
    'rainfall': 'rainfall',
    '1小时雨量': 'oneHourRain',
    'oneHourRain': 'oneHourRain',
  };

  data.forEach((row, index) => {
    try {
      const mapped: Record<string, any> = {};
      for (const [key, value] of Object.entries(row)) {
        const mappedKey = fieldMap[key] || key.toLowerCase();
        mapped[mappedKey] = value;
      }

      if (!mapped.name) {
        errors.push(`第${index + 2}行缺少站点名称`);
        return;
      }

      const station: RainfallStation = {
        id: `imported_${Date.now()}_${index}`,
        name: String(mapped.name),
        basin: basinMap?.[String(mapped.basin || '')] || String(mapped.basin || '未分类'),
        rainfall: Number(mapped.rainfall) || 0,
        oneHourRain: Number(mapped.oneHourRain) || 0,
        warningLevel: 'normal',
        updateTime: new Date().toISOString().slice(0, 16).replace('T', ' '),
      };

      stations.push(station);
    } catch (e) {
      errors.push(`第${index + 2}行解析失败: ${e}`);
    }
  });

  return { success: errors.length === 0, data: stations, errors };
}

export function mapToWaterLevelStations(data: any[], basinMap?: Record<string, string>): ParseResult<WaterLevelStation> {
  const errors: string[] = [];
  const stations: WaterLevelStation[] = [];

  data.forEach((row, index) => {
    try {
      const station: WaterLevelStation = {
        id: `imported_${Date.now()}_${index}`,
        name: String(row['站名'] || row['name'] || row['站点名称'] || ''),
        basin: basinMap?.[String(row['流域'] || row['basin'] || '')] || String(row['流域'] || row['basin'] || '未分类'),
        currentLevel: Number(row['水位'] || row['currentLevel'] || row['当前水位']) || 0,
        warningLevel: Number(row['警戒水位'] || row['warningLevel']) || 0,
        isOverWarning: false,
        trend: 'stable',
        updateTime: new Date().toISOString().slice(0, 16).replace('T', ' '),
      };

      if (!station.name) {
        errors.push(`第${index + 2}行缺少站点名称`);
        return;
      }

      station.isOverWarning = station.currentLevel >= station.warningLevel;
      stations.push(station);
    } catch (e) {
      errors.push(`第${index + 2}行解析失败: ${e}`);
    }
  });

  return { success: errors.length === 0, data: stations, errors };
}

export function mapToReservoirs(data: any[], basinMap?: Record<string, string>): ParseResult<Reservoir> {
  const errors: string[] = [];
  const reservoirs: Reservoir[] = [];

  data.forEach((row, index) => {
    try {
      const reservoir: Reservoir = {
        id: `imported_${Date.now()}_${index}`,
        name: String(row['水库名称'] || row['name'] || row['站名'] || ''),
        basin: basinMap?.[String(row['流域'] || row['basin'] || '')] || String(row['流域'] || row['basin'] || '未分类'),
        isDangerous: Boolean(row['病险水库'] || row['isDangerous'] || row['是否病险'] === '是' || row['是否病险'] === true),
        currentLevel: Number(row['当前水位'] || row['currentLevel'] || row['水位']) || 0,
        maxLevel: Number(row['校核水位'] || row['maxLevel'] || row['最高水位'] || row['汛限水位']) || 0,
        storage: Number(row['库容'] || row['storage'] || row['当前库容']) || 0,
        outflow: Number(row['出库流量'] || row['outflow'] || row['泄洪量']) || 0,
        updateTime: new Date().toISOString().slice(0, 16).replace('T', ' '),
      };

      if (!reservoir.name) {
        errors.push(`第${index + 2}行缺少水库名称`);
        return;
      }

      reservoirs.push(reservoir);
    } catch (e) {
      errors.push(`第${index + 2}行解析失败: ${e}`);
    }
  });

  return { success: errors.length === 0, data: reservoirs, errors };
}

export function mapToPumpStations(data: any[], basinMap?: Record<string, string>): ParseResult<PumpStation> {
  const errors: string[] = [];
  const pumpStations: PumpStation[] = [];

  data.forEach((row, index) => {
    try {
      const pumpStation: PumpStation = {
        id: `imported_${Date.now()}_${index}`,
        name: String(row['泵站名称'] || row['name'] || row['站名'] || ''),
        basin: basinMap?.[String(row['流域'] || row['basin'] || '')] || String(row['流域'] || row['basin'] || '未分类'),
        runningCount: Number(row['运行台数'] || row['runningCount'] || row['开机台数']) || 0,
        totalCapacity: Number(row['总装机容量'] || row['totalCapacity'] || row['装机容量']) || 0,
        drainageVolume: Number(row['排涝量'] || row['drainageVolume'] || row['累计排涝量']) || 0,
        updateTime: new Date().toISOString().slice(0, 16).replace('T', ' '),
      };

      if (!pumpStation.name) {
        errors.push(`第${index + 2}行缺少泵站名称`);
        return;
      }

      pumpStations.push(pumpStation);
    } catch (e) {
      errors.push(`第${index + 2}行解析失败: ${e}`);
    }
  });

  return { success: errors.length === 0, data: pumpStations, errors };
}

export function detectFileType(fileName: string): 'rainfall' | 'waterLevel' | 'reservoir' | 'pump' | 'unknown' {
  const lowerName = fileName.toLowerCase();
  if (lowerName.includes('雨量') || lowerName.includes('rain') || lowerName.includes('rainfall')) {
    return 'rainfall';
  }
  if (lowerName.includes('水位') || lowerName.includes('water') || lowerName.includes('level')) {
    return 'waterLevel';
  }
  if (lowerName.includes('水库') || lowerName.includes('reservoir')) {
    return 'reservoir';
  }
  if (lowerName.includes('泵站') || lowerName.includes('pump') || lowerName.includes('排涝')) {
    return 'pump';
  }
  return 'unknown';
}
