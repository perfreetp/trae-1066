import type {
  RainfallStation,
  WaterLevelStation,
  Reservoir,
  PumpStation,
  BasinSummary,
} from '@/types';

export function getMaxRainfall(stations: RainfallStation[]): RainfallStation | null {
  if (stations.length === 0) return null;
  return stations.reduce((max, station) => 
    station.rainfall > max.rainfall ? station : max
  );
}

export function getOverWarningStations(stations: WaterLevelStation[]): WaterLevelStation[] {
  return stations.filter(s => s.isOverWarning);
}

export function getDangerousReservoirs(reservoirs: Reservoir[]): Reservoir[] {
  return reservoirs.filter(r => r.isDangerous);
}

export function getTotalDrainageVolume(stations: PumpStation[]): number {
  return stations.reduce((sum, s) => sum + s.drainageVolume, 0);
}

export function groupByBasin<T extends { basin: string }>(items: T[]): Record<string, T[]> {
  return items.reduce((groups, item) => {
    if (!groups[item.basin]) {
      groups[item.basin] = [];
    }
    groups[item.basin].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

export function calculateBasinSummary(
  rainfallStations: RainfallStation[],
  waterLevelStations: WaterLevelStation[],
  reservoirs: Reservoir[],
  pumpStations: PumpStation[]
): BasinSummary[] {
  const rainfallByBasin = groupByBasin(rainfallStations);
  const waterLevelByBasin = groupByBasin(waterLevelStations);
  const reservoirsByBasin = groupByBasin(reservoirs);
  const pumpByBasin = groupByBasin(pumpStations);

  const allBasins = new Set([
    ...Object.keys(rainfallByBasin),
    ...Object.keys(waterLevelByBasin),
    ...Object.keys(reservoirsByBasin),
    ...Object.keys(pumpByBasin),
  ]);

  return Array.from(allBasins).map(basin => {
    const basinRainfall = rainfallByBasin[basin] || [];
    const basinWaterLevel = waterLevelByBasin[basin] || [];
    const basinReservoirs = reservoirsByBasin[basin] || [];
    const basinPumps = pumpByBasin[basin] || [];

    const avgRainfall = basinRainfall.length > 0
      ? basinRainfall.reduce((sum, s) => sum + s.rainfall, 0) / basinRainfall.length
      : 0;

    const maxRainfall = basinRainfall.length > 0
      ? Math.max(...basinRainfall.map(s => s.rainfall))
      : 0;

    return {
      basin,
      avgRainfall: Math.round(avgRainfall * 10) / 10,
      maxRainfall,
      stationCount: basinRainfall.length,
      overWarningCount: basinWaterLevel.filter(s => s.isOverWarning).length,
      dangerousReservoirCount: basinReservoirs.filter(r => r.isDangerous).length,
      drainageVolume: basinPumps.reduce((sum, p) => sum + p.drainageVolume, 0),
    };
  });
}

export function generateDailySummary(
  rainfallStations: RainfallStation[],
  waterLevelStations: WaterLevelStation[],
  reservoirs: Reservoir[],
  pumpStations: PumpStation[]
): string {
  const maxRainfall = getMaxRainfall(rainfallStations);
  const overWarningCount = getOverWarningStations(waterLevelStations).length;
  const dangerousCount = getDangerousReservoirs(reservoirs).length;
  const totalDrainage = getTotalDrainageVolume(pumpStations);
  const avgRainfall = rainfallStations.length > 0
    ? Math.round(rainfallStations.reduce((sum, s) => sum + s.rainfall, 0) / rainfallStations.length * 10) / 10
    : 0;

  return `今日全市平均降雨量${avgRainfall}mm，最大降雨量${maxRainfall?.rainfall || 0}mm（${maxRainfall?.name || '无数据'}）。
${overWarningCount > 0 ? `有${overWarningCount}个水文站超警戒水位。` : '各水文站水位均在警戒水位以下。'}
${dangerousCount > 0 ? `${dangerousCount}座病险水库正在加强监测。` : '水库运行正常。'}
各泵站累计排涝${totalDrainage}万立方米。`;
}
