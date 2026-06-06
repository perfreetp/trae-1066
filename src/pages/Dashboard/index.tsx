import { useNavigate } from 'react-router-dom';
import {
  CloudRain,
  Droplets,
  AlertTriangle,
  Clock,
  ChevronRight,
  TrendingUp,
  Zap,
  Users,
  FileText,
  FileUp,
  Edit3,
  Send,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { StatCard } from '@/components/StatCard';
import { useStore } from '@/store/useStore';
import { getMaxRainfall, getOverWarningStations, getDangerousReservoirs, getTotalDrainageVolume, calculateBasinSummary } from '@/utils/dataProcessor';

const quickActions = [
  { label: '资料导入', icon: FileUp, path: '/import', color: 'bg-blue-500' },
  { label: '数据核对', icon: FileText, path: '/verify', color: 'bg-green-500' },
  { label: '日报编辑', icon: Edit3, path: '/editor', color: 'bg-purple-500' },
  { label: '分发归档', icon: Send, path: '/archive', color: 'bg-orange-500' },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const rainfallStations = useStore((state) => state.rainfallStations);
  const waterLevelStations = useStore((state) => state.waterLevelStations);
  const reservoirs = useStore((state) => state.reservoirs);
  const pumpStations = useStore((state) => state.pumpStations);
  const warnings = useStore((state) => state.warnings);
  const disposals = useStore((state) => state.disposals);

  const maxRainfall = getMaxRainfall(rainfallStations);
  const overWarningCount = getOverWarningStations(waterLevelStations).length;
  const dangerousReservoirCount = getDangerousReservoirs(reservoirs).length;
  const totalDrainage = getTotalDrainageVolume(pumpStations);
  const pendingDisposals = disposals.filter((d) => d.status === 'pending' || d.status === 'processing').length;
  const activeWarnings = warnings.filter((w) => !w.isHandled).length;

  const basinSummary = calculateBasinSummary(rainfallStations, waterLevelStations, reservoirs, pumpStations);
  const chartData = basinSummary.map((b) => ({
    name: b.basin.replace('流域', ''),
    平均雨量: b.avgRainfall,
    最大雨量: b.maxRainfall,
  }));

  const recentWarnings = warnings.slice(0, 4);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">防汛值班总览</h1>
          <p className="mt-1 text-sm text-gray-500">实时监控雨情水情，及时处置预警信息</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            系统运行正常
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="最大降雨量"
          value={`${maxRainfall?.rainfall || 0}mm`}
          subtitle={maxRainfall?.name || '无数据'}
          icon={CloudRain}
          trend="up"
          trendValue="较昨日 +12%"
          color="blue"
        />
        <StatCard
          title="超警水位站"
          value={overWarningCount}
          subtitle="个站点"
          icon={Droplets}
          trend="stable"
          trendValue="与昨日持平"
          color="red"
        />
        <StatCard
          title="待处理预警"
          value={activeWarnings}
          subtitle="条预警"
          icon={AlertTriangle}
          trend="down"
          trendValue="较昨日 -2"
          color="orange"
        />
        <StatCard
          title="排涝总量"
          value={`${totalDrainage}万m³`}
          subtitle={`${pumpStations.length}座泵站运行`}
          icon={Zap}
          trend="up"
          trendValue="较昨日 +8%"
          color="green"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">流域降雨量统计</h2>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-blue-500"></span>
                平均雨量
              </span>
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-secondary-500"></span>
                最大雨量
              </span>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barGap={8}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Bar dataKey="平均雨量" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="最大雨量" fill="#1687A7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">快捷操作</h2>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.label}
                    onClick={() => navigate(action.path)}
                    className="flex flex-col items-center gap-2 rounded-xl p-4 bg-gray-50 hover:bg-gray-100 transition-colors group"
                  >
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${action.color} text-white group-hover:scale-110 transition-transform`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{action.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 p-6 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5" />
              <span className="font-medium">值班提醒</span>
            </div>
            <p className="text-white/80 text-sm mb-4">距离今日日报提交截止还有</p>
            <p className="text-3xl font-bold">04:32:15</p>
            <button className="mt-4 w-full rounded-lg bg-white/20 py-2 text-sm font-medium hover:bg-white/30 transition-colors">
              立即处理
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">最新预警</h2>
            <button onClick={() => navigate('/warnings')} className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1">
              查看全部 <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-3">
            {recentWarnings.map((warning) => (
              <div
                key={warning.id}
                className="flex items-center justify-between rounded-lg border border-gray-100 p-4 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                      warning.level === 'red'
                        ? 'bg-red-100 text-red-600'
                        : warning.level === 'orange'
                        ? 'bg-orange-100 text-orange-600'
                        : warning.level === 'yellow'
                        ? 'bg-yellow-100 text-yellow-600'
                        : 'bg-blue-100 text-blue-600'
                    }`}
                  >
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{warning.title}</p>
                    <p className="text-sm text-gray-500">{warning.location}</p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    warning.isHandled
                      ? 'bg-green-100 text-green-700'
                      : warning.level === 'red'
                      ? 'bg-red-100 text-red-700 animate-pulse-slow'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {warning.isHandled ? '已处理' : '待处理'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">处置跟踪</h2>
            <button onClick={() => navigate('/disposal')} className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1">
              查看全部 <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-3">
            {disposals.slice(0, 4).map((disposal) => (
              <div key={disposal.id} className="rounded-lg border border-gray-100 p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-gray-900 text-sm">{disposal.title}</p>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium ${
                      disposal.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : disposal.status === 'processing'
                        ? 'bg-blue-100 text-blue-700'
                        : disposal.status === 'delayed'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {disposal.status === 'completed'
                      ? '已完成'
                      : disposal.status === 'processing'
                      ? '处理中'
                      : disposal.status === 'delayed'
                      ? '已延期'
                      : '待开始'}
                  </span>
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-500">责任人：{disposal.personInCharge}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${disposal.progress}%` }}
                  ></div>
                </div>
                <p className="text-right text-xs text-gray-400 mt-1">{disposal.progress}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
