import { useState } from 'react';
import {
  AlertTriangle,
  CloudRain,
  Droplets,
  Waves,
  MoreHorizontal,
  Filter,
  Search,
  CheckCircle,
  Clock,
  MapPin,
  ChevronDown,
  Plus,
  X,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import type { WarningItem, WarningLevel, WarningType } from '@/types';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';

export default function WarningList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const warnings = useStore((state) => state.warnings);
  const updateWarning = useStore((state) => state.updateWarning);

  const getLevelColor = (level: WarningLevel) => {
    switch (level) {
      case 'red': return 'bg-red-100 text-red-700 border-red-200';
      case 'orange': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'yellow': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'blue': return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  const getLevelDot = (level: WarningLevel) => {
    switch (level) {
      case 'red': return 'bg-red-500';
      case 'orange': return 'bg-orange-500';
      case 'yellow': return 'bg-yellow-500';
      case 'blue': return 'bg-blue-500';
    }
  };

  const getLevelText = (level: WarningLevel) => {
    switch (level) {
      case 'red': return '红色预警';
      case 'orange': return '橙色预警';
      case 'yellow': return '黄色预警';
      case 'blue': return '蓝色预警';
    }
  };

  const getTypeIcon = (type: WarningType) => {
    switch (type) {
      case 'rainfall': return CloudRain;
      case 'waterLevel': return Droplets;
      case 'reservoir': return Waves;
      default: return AlertTriangle;
    }
  };

  const getTypeText = (type: WarningType) => {
    switch (type) {
      case 'rainfall': return '雨量预警';
      case 'waterLevel': return '水位预警';
      case 'reservoir': return '水库预警';
      default: return '其他预警';
    }
  };

  const filteredWarnings = warnings.filter((w) => {
    if (levelFilter !== 'all' && w.level !== levelFilter) return false;
    if (typeFilter !== 'all' && w.type !== typeFilter) return false;
    if (searchQuery && !w.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total: warnings.length,
    pending: warnings.filter((w) => !w.isHandled).length,
    red: warnings.filter((w) => w.level === 'red' && !w.isHandled).length,
    orange: warnings.filter((w) => w.level === 'orange' && !w.isHandled).length,
  };

  const handleMarkHandled = (id: string) => {
    updateWarning(id, {
      isHandled: true,
      handleTime: dayjs().format('YYYY-MM-DD HH:mm'),
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">预警清单</h1>
          <p className="mt-1 text-sm text-gray-500">管理和跟踪所有预警信息</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          新增预警
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl bg-white p-4 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">预警总数</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
        </div>
        <div className="rounded-xl bg-white p-4 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">待处理</p>
          <p className="text-2xl font-bold text-warning-red mt-1">{stats.pending}</p>
        </div>
        <div className="rounded-xl bg-white p-4 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">红色预警</p>
          <p className="text-2xl font-bold text-red-600 mt-1">{stats.red}</p>
        </div>
        <div className="rounded-xl bg-white p-4 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">橙色预警</p>
          <p className="text-2xl font-bold text-orange-600 mt-1">{stats.orange}</p>
        </div>
      </div>

      <div className="rounded-xl bg-white shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="搜索预警..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
            <div className="flex items-center gap-3">
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className="rounded-lg border border-gray-200 py-2 px-3 text-sm"
              >
                <option value="all">全部级别</option>
                <option value="red">红色</option>
                <option value="orange">橙色</option>
                <option value="yellow">黄色</option>
                <option value="blue">蓝色</option>
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="rounded-lg border border-gray-200 py-2 px-3 text-sm"
              >
                <option value="all">全部类型</option>
                <option value="rainfall">雨量</option>
                <option value="waterLevel">水位</option>
                <option value="reservoir">水库</option>
                <option value="other">其他</option>
              </select>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {filteredWarnings.map((warning) => {
            const TypeIcon = getTypeIcon(warning.type);
            const isExpanded = expandedId === warning.id;

            return (
              <div key={warning.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={cn(
                      'flex h-12 w-12 items-center justify-center rounded-xl flex-shrink-0',
                      getLevelColor(warning.level)
                    )}>
                      <TypeIcon className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-gray-900">{warning.title}</h3>
                        <span className={cn(
                          'px-2 py-0.5 rounded text-xs font-medium border',
                          getLevelColor(warning.level)
                        )}>
                          {getLevelText(warning.level)}
                        </span>
                        {warning.isHandled ? (
                          <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">
                            已处置
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700 animate-pulse-slow">
                            <span className={cn('h-2 w-2 rounded-full', getLevelDot(warning.level))}></span>
                            待处置
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">{warning.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {warning.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {warning.createTime}
                        </span>
                        <span>{getTypeText(warning.type)}</span>
                      </div>

                      {isExpanded && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">详细信息</h4>
                          <p className="text-sm text-gray-600">{warning.description}</p>
                          {warning.handleTime && (
                            <p className="text-sm text-gray-500 mt-2">
                              处置时间：{warning.handleTime}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!warning.isHandled && (
                      <button
                        onClick={() => handleMarkHandled(warning.id)}
                        className="rounded-lg px-3 py-1.5 text-sm text-green-600 hover:bg-green-50 transition-colors"
                      >
                        标记已处置
                      </button>
                    )}
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : warning.id)}
                      className="p-2 text-gray-400 hover:text-gray-600"
                    >
                      <ChevronDown className={cn('h-4 w-4 transition-transform', isExpanded && 'rotate-180')} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl bg-white p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">新增预警</h2>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">预警标题</label>
                <input type="text" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">预警级别</label>
                  <select className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm">
                    <option value="blue">蓝色预警</option>
                    <option value="yellow">黄色预警</option>
                    <option value="orange">橙色预警</option>
                    <option value="red">红色预警</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">预警类型</label>
                  <select className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm">
                    <option value="rainfall">雨量预警</option>
                    <option value="waterLevel">水位预警</option>
                    <option value="reservoir">水库预警</option>
                    <option value="other">其他预警</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">发生地点</label>
                <input type="text" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">预警描述</label>
                <textarea rows={3} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 rounded-lg border border-gray-200 py-2 text-sm font-medium hover:bg-gray-50"
                >
                  取消
                </button>
                <button className="flex-1 rounded-lg bg-primary-600 py-2 text-sm font-medium text-white hover:bg-primary-700">
                  确认添加
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
