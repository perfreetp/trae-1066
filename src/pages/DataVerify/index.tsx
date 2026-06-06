import { useState } from 'react';
import { Tabs, Tab } from '@/components/common/Tabs';
import { CloudRain, Droplets, Waves, Zap, AlertTriangle, CheckCircle, Filter, Search, ArrowUpDown, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { getMaxRainfall, getOverWarningStations, getDangerousReservoirs, getTotalDrainageVolume, groupByBasin } from '@/utils/dataProcessor';
import { cn } from '@/lib/utils';

export default function DataVerify() {
  const [activeTab, setActiveTab] = useState('rainfall');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBasin, setSelectedBasin] = useState<string>('all');

  const rainfallStations = useStore((state) => state.rainfallStations);
  const waterLevelStations = useStore((state) => state.waterLevelStations);
  const reservoirs = useStore((state) => state.reservoirs);
  const pumpStations = useStore((state) => state.pumpStations);
  const systemConfig = useStore((state) => state.systemConfig);

  const maxRainfall = getMaxRainfall(rainfallStations);
  const overWarningCount = getOverWarningStations(waterLevelStations).length;
  const dangerousCount = getDangerousReservoirs(reservoirs).length;
  const totalDrainage = getTotalDrainageVolume(pumpStations);

  const filterByBasin = <T extends { basin: string }>(items: T[], basin: string) => {
    if (basin === 'all') return items;
    return items.filter((item) => item.basin === basin);
  };

  const filterByName = <T extends { name: string }>(items: T[], query: string) => {
    if (!query) return items;
    return items.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()));
  };

  const filteredRainfall = filterByName(filterByBasin(rainfallStations, selectedBasin), searchQuery);
  const filteredWaterLevel = filterByName(filterByBasin(waterLevelStations, selectedBasin), searchQuery);
  const filteredReservoirs = filterByName(filterByBasin(reservoirs, selectedBasin), searchQuery);
  const filteredPumps = filterByName(filterByBasin(pumpStations, selectedBasin), searchQuery);

  const getWarningLevelColor = (level: string) => {
    switch (level) {
      case 'emergency': return 'bg-red-100 text-red-700';
      case 'warning': return 'bg-orange-100 text-orange-700';
      case 'attention': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-green-100 text-green-700';
    }
  };

  const getWarningLevelText = (level: string) => {
    switch (level) {
      case 'emergency': return '特急';
      case 'warning': return '预警';
      case 'attention': return '注意';
      default: return '正常';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'rising': return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'falling': return <TrendingDown className="h-4 w-4 text-green-500" />;
      default: return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const tabs = [
    { id: 'rainfall', label: '雨量数据', icon: CloudRain },
    { id: 'waterLevel', label: '水位数据', icon: Droplets },
    { id: 'reservoir', label: '水库信息', icon: Waves },
    { id: 'pump', label: '泵站统计', icon: Zap },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">数据核对</h1>
        <p className="mt-1 text-sm text-gray-500">核对各站点数据，标记异常信息</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl bg-white p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <CloudRain className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{rainfallStations.length}</p>
              <p className="text-xs text-gray-500">雨量站点</p>
            </div>
          </div>
          {maxRainfall && (
            <p className="mt-2 text-xs text-blue-600">最大：{maxRainfall.name} {maxRainfall.rainfall}mm</p>
          )}
        </div>

        <div className="rounded-xl bg-white p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-100 text-cyan-600">
              <Droplets className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{overWarningCount}</p>
              <p className="text-xs text-gray-500">超警站点</p>
            </div>
          </div>
          <p className="mt-2 text-xs text-cyan-600">共{waterLevelStations.length}个水位站</p>
        </div>

        <div className="rounded-xl bg-white p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
              <Waves className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{dangerousCount}</p>
              <p className="text-xs text-gray-500">病险水库</p>
            </div>
          </div>
          <p className="mt-2 text-xs text-orange-600">共{reservoirs.length}座水库</p>
        </div>

        <div className="rounded-xl bg-white p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalDrainage}</p>
              <p className="text-xs text-gray-500">排涝量(万m³)</p>
            </div>
          </div>
          <p className="mt-2 text-xs text-green-600">{pumpStations.length}座泵站运行</p>
        </div>
      </div>

      <div className="rounded-xl bg-white shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索站点..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-48 rounded-lg border border-gray-200 py-2 pl-10 pr-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
              </div>
              <select
                value={selectedBasin}
                onChange={(e) => setSelectedBasin(e.target.value)}
                className="rounded-lg border border-gray-200 py-2 px-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              >
                <option value="all">全部流域</option>
                {systemConfig.basins.map((basin) => (
                  <option key={basin} value={basin}>{basin}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {activeTab === 'rainfall' && (
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left font-medium text-gray-700">站点名称</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-700">所属流域</th>
                  <th className="px-6 py-3 text-right font-medium text-gray-700">累计雨量(mm)</th>
                  <th className="px-6 py-3 text-right font-medium text-gray-700">1小时雨量(mm)</th>
                  <th className="px-6 py-3 text-center font-medium text-gray-700">预警级别</th>
                  <th className="px-6 py-3 text-center font-medium text-gray-700">更新时间</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredRainfall.map((station) => (
                  <tr
                    key={station.id}
                    className={cn(
                      'hover:bg-gray-50 transition-colors',
                      station.warningLevel === 'emergency' && 'bg-red-50/50',
                      station.warningLevel === 'warning' && 'bg-orange-50/50'
                    )}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {station.warningLevel !== 'normal' && (
                          <AlertTriangle className="h-4 w-4 text-warning-red" />
                        )}
                        <span className="font-medium text-gray-900">{station.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{station.basin}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={cn(
                        'font-semibold',
                        station.rainfall >= 150 && 'text-red-600',
                        station.rainfall >= 100 && station.rainfall < 150 && 'text-orange-600'
                      )}>
                        {station.rainfall}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-gray-600">{station.oneHourRain}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={cn('px-2 py-1 rounded-full text-xs font-medium', getWarningLevelColor(station.warningLevel))}>
                        {getWarningLevelText(station.warningLevel)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-gray-500 text-xs">{station.updateTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'waterLevel' && (
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left font-medium text-gray-700">站点名称</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-700">所属流域</th>
                  <th className="px-6 py-3 text-right font-medium text-gray-700">当前水位(m)</th>
                  <th className="px-6 py-3 text-right font-medium text-gray-700">警戒水位(m)</th>
                  <th className="px-6 py-3 text-center font-medium text-gray-700">趋势</th>
                  <th className="px-6 py-3 text-center font-medium text-gray-700">状态</th>
                  <th className="px-6 py-3 text-center font-medium text-gray-700">更新时间</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredWaterLevel.map((station) => (
                  <tr
                    key={station.id}
                    className={cn('hover:bg-gray-50 transition-colors', station.isOverWarning && 'bg-red-50/50')}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {station.isOverWarning && <AlertTriangle className="h-4 w-4 text-warning-red" />}
                        <span className="font-medium text-gray-900">{station.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{station.basin}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={cn('font-semibold', station.isOverWarning && 'text-red-600')}>
                        {station.currentLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-gray-600">{station.warningLevel}</td>
                    <td className="px-6 py-4 text-center">{getTrendIcon(station.trend)}</td>
                    <td className="px-6 py-4 text-center">
                      {station.isOverWarning ? (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">超警</span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">正常</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center text-gray-500 text-xs">{station.updateTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'reservoir' && (
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left font-medium text-gray-700">水库名称</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-700">所属流域</th>
                  <th className="px-6 py-3 text-right font-medium text-gray-700">当前水位(m)</th>
                  <th className="px-6 py-3 text-right font-medium text-gray-700">最高水位(m)</th>
                  <th className="px-6 py-3 text-right font-medium text-gray-700">库容(万m³)</th>
                  <th className="px-6 py-3 text-center font-medium text-gray-700">类型</th>
                  <th className="px-6 py-3 text-center font-medium text-gray-700">更新时间</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredReservoirs.map((reservoir) => (
                  <tr
                    key={reservoir.id}
                    className={cn('hover:bg-gray-50 transition-colors', reservoir.isDangerous && 'bg-orange-50/50')}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {reservoir.isDangerous && <AlertTriangle className="h-4 w-4 text-warning-orange" />}
                        <span className="font-medium text-gray-900">{reservoir.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{reservoir.basin}</td>
                    <td className="px-6 py-4 text-right font-semibold">{reservoir.currentLevel}</td>
                    <td className="px-6 py-4 text-right text-gray-600">{reservoir.maxLevel}</td>
                    <td className="px-6 py-4 text-right text-gray-600">{reservoir.storage}</td>
                    <td className="px-6 py-4 text-center">
                      {reservoir.isDangerous ? (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">病险水库</span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">正常水库</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center text-gray-500 text-xs">{reservoir.updateTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'pump' && (
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left font-medium text-gray-700">泵站名称</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-700">所属流域</th>
                  <th className="px-6 py-3 text-center font-medium text-gray-700">运行台数</th>
                  <th className="px-6 py-3 text-right font-medium text-gray-700">总能力(m³/s)</th>
                  <th className="px-6 py-3 text-right font-medium text-gray-700">累计排涝(万m³)</th>
                  <th className="px-6 py-3 text-center font-medium text-gray-700">更新时间</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPumps.map((pump) => (
                  <tr key={pump.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{pump.name}</td>
                    <td className="px-6 py-4 text-gray-600">{pump.basin}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-semibold text-green-600">{pump.runningCount}</span>
                      <span className="text-gray-500">/{pump.runningCount + 2}</span>
                    </td>
                    <td className="px-6 py-4 text-right text-gray-600">{pump.totalCapacity}</td>
                    <td className="px-6 py-4 text-right font-semibold text-primary-600">{pump.drainageVolume}</td>
                    <td className="px-6 py-4 text-center text-gray-500 text-xs">{pump.updateTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
