import { useState } from 'react';
import {
  FileText,
  CloudRain,
  Droplets,
  Waves,
  Zap,
  TrendingUp,
  AlertTriangle,
  RefreshCw,
  Copy,
  ChevronRight,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import { useStore } from '@/store/useStore';
import {
  calculateBasinSummary,
  generateDailySummary,
  getMaxRainfall,
  getOverWarningStations,
  getDangerousReservoirs,
  getTotalDrainageVolume,
} from '@/utils/dataProcessor';

export default function Summary() {
  const [selectedBasin, setSelectedBasin] = useState<string>('all');

  const rainfallStations = useStore((state) => state.rainfallStations);
  const waterLevelStations = useStore((state) => state.waterLevelStations);
  const reservoirs = useStore((state) => state.reservoirs);
  const pumpStations = useStore((state) => state.pumpStations);
  const warnings = useStore((state) => state.warnings);
  const systemConfig = useStore((state) => state.systemConfig);

  const basinSummary = calculateBasinSummary(rainfallStations, waterLevelStations, reservoirs, pumpStations);
  const dailySummary = generateDailySummary(rainfallStations, waterLevelStations, reservoirs, pumpStations);
  const maxRainfall = getMaxRainfall(rainfallStations);

  const topRainfall = [...rainfallStations].sort((a, b) => b.rainfall - a.rainfall).slice(0, 5);
  const overWarningStations = getOverWarningStations(waterLevelStations);
  const dangerousReservoirs = getDangerousReservoirs(reservoirs);

  const barData = basinSummary.map((b) => ({
    name: b.basin.replace('流域', ''),
    平均雨量: b.avgRainfall,
    最大雨量: b.maxRainfall,
  }));

  const pieData = [
    { name: '正常', value: warnings.filter((w) => w.isHandled).length, color: '#22c55e' },
    { name: '待处理', value: warnings.filter((w) => !w.isHandled).length, color: '#ef4444' },
  ];

  const trendData = [
    { time: '08:00', 长江: 85, 黄河: 42, 珠江: 120 },
    { time: '10:00', 长江: 98, 黄河: 48, 珠江: 145 },
    { time: '12:00', 长江: 110, 黄河: 52, 珠江: 168 },
    { time: '14:00', 长江: 125, 黄河: 56, 珠江: 185 },
    { time: '16:00', 长江: 124, 黄河: 58, 珠江: 172 },
  ];

  const COLORS = ['#3B82F6', '#1687A7', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">重点摘要</h1>
          <p className="mt-1 text-sm text-gray-500">自动提取关键信息，生成值班要情</p>
        </div>
        <div className="flex items-center gap-3">
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

      <div className="rounded-xl bg-gradient-to-r from-primary-600 to-secondary-500 p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">今日值班要情</h2>
              <p className="text-sm text-white/80">系统自动生成</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 rounded-lg bg-white/20 px-3 py-2 text-sm hover:bg-white/30 transition-colors">
              <RefreshCw className="h-4 w-4" />
              刷新
            </button>
            <button className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm text-primary-600 hover:bg-white/90 transition-colors">
              <Copy className="h-4 w-4" />
              复制
            </button>
          </div>
        </div>
        <div className="rounded-lg bg-white/10 p-4">
          <p className="text-sm leading-relaxed whitespace-pre-line">{dailySummary}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">流域雨量对比</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                <Legend />
                <Bar dataKey="平均雨量" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="最大雨量" fill="#1687A7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">雨量趋势图</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                <Legend />
                <Line type="monotone" dataKey="长江" stroke="#3B82F6" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="黄河" stroke="#F59E0B" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="珠江" stroke="#1687A7" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">雨量排名</h2>
            <CloudRain className="h-5 w-5 text-blue-500" />
          </div>
          <div className="space-y-3">
            {topRainfall.map((station, index) => (
              <div key={station.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                    index === 0 ? 'bg-yellow-100 text-yellow-700' :
                    index === 1 ? 'bg-gray-100 text-gray-700' :
                    index === 2 ? 'bg-orange-100 text-orange-700' :
                    'bg-gray-50 text-gray-600'
                  }`}>
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{station.name}</p>
                    <p className="text-xs text-gray-500">{station.basin}</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-gray-900">{station.rainfall}mm</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">超警站点</h2>
            <AlertTriangle className="h-5 w-5 text-red-500" />
          </div>
          {overWarningStations.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">暂无超警站点</p>
          ) : (
            <div className="space-y-3">
              {overWarningStations.map((station) => (
                <div key={station.id} className="flex items-center justify-between p-3 rounded-lg bg-red-50">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{station.name}</p>
                    <p className="text-xs text-gray-500">{station.basin}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-red-600">{station.currentLevel}m</p>
                    <p className="text-xs text-red-500">超警{(station.currentLevel - station.warningLevel).toFixed(2)}m</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">预警统计</h2>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={55}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="space-y-2 mt-4">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
                <span className="text-sm font-medium">{item.value}条</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">流域汇总表</h2>
          <button className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1">
            导出报表 <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-gray-700">流域</th>
                <th className="px-6 py-3 text-right font-medium text-gray-700">站点数</th>
                <th className="px-6 py-3 text-right font-medium text-gray-700">平均雨量(mm)</th>
                <th className="px-6 py-3 text-right font-medium text-gray-700">最大雨量(mm)</th>
                <th className="px-6 py-3 text-center font-medium text-gray-700">超警站点</th>
                <th className="px-6 py-3 text-center font-medium text-gray-700">病险水库</th>
                <th className="px-6 py-3 text-right font-medium text-gray-700">排涝量(万m³)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {basinSummary.map((basin) => (
                <tr key={basin.basin} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{basin.basin}</td>
                  <td className="px-6 py-4 text-right text-gray-600">{basin.stationCount}</td>
                  <td className="px-6 py-4 text-right text-gray-600">{basin.avgRainfall}</td>
                  <td className="px-6 py-4 text-right font-semibold text-blue-600">{basin.maxRainfall}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={cn(
                      'px-2 py-1 rounded-full text-xs font-medium',
                      basin.overWarningCount > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                    )}>
                      {basin.overWarningCount}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={cn(
                      'px-2 py-1 rounded-full text-xs font-medium',
                      basin.dangerousReservoirCount > 0 ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                    )}>
                      {basin.dangerousReservoirCount}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-green-600">{basin.drainageVolume}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
