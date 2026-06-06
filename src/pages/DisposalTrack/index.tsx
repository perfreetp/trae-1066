import { useState } from 'react';
import {
  ClipboardList,
  Plus,
  Search,
  Filter,
  Clock,
  User,
  CheckCircle2,
  AlertCircle,
  PlayCircle,
  PauseCircle,
  X,
  MessageSquare,
  Send,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import type { DisposalItem, DisposalStatus } from '@/types';
import { cn } from '@/lib/utils';

export default function DisposalTrack() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DisposalItem | null>(null);
  const [newRemark, setNewRemark] = useState('');

  const disposals = useStore((state) => state.disposals);
  const updateDisposal = useStore((state) => state.updateDisposal);
  const warnings = useStore((state) => state.warnings);

  const getStatusColor = (status: DisposalStatus) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'processing': return 'bg-blue-100 text-blue-700';
      case 'delayed': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: DisposalStatus) => {
    switch (status) {
      case 'completed': return '已完成';
      case 'processing': return '处理中';
      case 'delayed': return '已延期';
      default: return '待开始';
    }
  };

  const getStatusIcon = (status: DisposalStatus) => {
    switch (status) {
      case 'completed': return CheckCircle2;
      case 'processing': return PlayCircle;
      case 'delayed': return AlertCircle;
      default: return PauseCircle;
    }
  };

  const filteredDisposals = disposals.filter((d) => {
    if (statusFilter !== 'all' && d.status !== statusFilter) return false;
    if (searchQuery && !d.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total: disposals.length,
    pending: disposals.filter((d) => d.status === 'pending').length,
    processing: disposals.filter((d) => d.status === 'processing').length,
    completed: disposals.filter((d) => d.status === 'completed').length,
  };

  const handleUpdateProgress = (id: string, progress: number) => {
    const updates: Partial<DisposalItem> = { progress };
    if (progress === 100) updates.status = 'completed';
    else if (progress > 0) updates.status = 'processing';
    updateDisposal(id, updates);
  };

  const handleAddRemark = () => {
    if (!selectedItem || !newRemark.trim()) return;
    updateDisposal(selectedItem.id, {
      remarks: [...selectedItem.remarks, newRemark],
    });
    setNewRemark('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">处置跟踪</h1>
          <p className="mt-1 text-sm text-gray-500">跟踪处置事项进度，确保闭环管理</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          新增处置
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl bg-white p-4 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">处置总数</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
        </div>
        <div className="rounded-xl bg-white p-4 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">待开始</p>
          <p className="text-2xl font-bold text-gray-500 mt-1">{stats.pending}</p>
        </div>
        <div className="rounded-xl bg-white p-4 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">处理中</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{stats.processing}</p>
        </div>
        <div className="rounded-xl bg-white p-4 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">已完成</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{stats.completed}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="搜索处置事项..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-gray-200 py-2 px-3 text-sm"
            >
              <option value="all">全部状态</option>
              <option value="pending">待开始</option>
              <option value="processing">处理中</option>
              <option value="completed">已完成</option>
              <option value="delayed">已延期</option>
            </select>
          </div>

          <div className="space-y-3">
            {filteredDisposals.map((disposal) => {
              const StatusIcon = getStatusIcon(disposal.status);
              const relatedWarning = warnings.find((w) => w.id === disposal.relatedWarningId);

              return (
                <div
                  key={disposal.id}
                  onClick={() => setSelectedItem(disposal)}
                  className={cn(
                    'rounded-xl border p-4 cursor-pointer transition-all duration-200',
                    selectedItem?.id === disposal.id
                      ? 'border-primary-300 bg-primary-50/50 shadow-md'
                      : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm'
                  )}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', getStatusColor(disposal.status))}>
                        <StatusIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{disposal.title}</h3>
                        {relatedWarning && (
                          <span className="inline-block mt-1 px-2 py-0.5 rounded text-xs bg-orange-100 text-orange-700">
                            关联预警：{relatedWarning.title}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className={cn('px-2 py-1 rounded text-xs font-medium', getStatusColor(disposal.status))}>
                      {getStatusText(disposal.status)}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{disposal.description}</p>

                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {disposal.personInCharge}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      截止：{disposal.deadline}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      {disposal.remarks.length}条备注
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-500">进度</span>
                      <span className="font-medium text-gray-700">{disposal.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={cn(
                          'h-2 rounded-full transition-all duration-500',
                          disposal.progress === 100
                            ? 'bg-green-500'
                            : disposal.progress > 50
                            ? 'bg-blue-500'
                            : 'bg-primary-500'
                        )}
                        style={{ width: `${disposal.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {disposal.status !== 'completed' && (
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdateProgress(disposal.id, Math.min(disposal.progress + 20, 100));
                        }}
                        className="flex-1 rounded-lg bg-primary-50 py-1.5 text-xs font-medium text-primary-600 hover:bg-primary-100 transition-colors"
                      >
                        更新进度
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdateProgress(disposal.id, 100);
                        }}
                        className="flex-1 rounded-lg bg-green-50 py-1.5 text-xs font-medium text-green-600 hover:bg-green-100 transition-colors"
                      >
                        标记完成
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          {selectedItem ? (
            <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100 sticky top-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">处置详情</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900">{selectedItem.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{selectedItem.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500">责任人</p>
                    <p className="font-medium text-gray-900">{selectedItem.personInCharge}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">状态</p>
                    <p className="font-medium">
                      <span className={cn('px-2 py-0.5 rounded text-xs', getStatusColor(selectedItem.status))}>
                        {getStatusText(selectedItem.status)}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">创建时间</p>
                    <p className="font-medium text-gray-900">{selectedItem.createTime}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">截止时间</p>
                    <p className="font-medium text-gray-900">{selectedItem.deadline}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">当前进度：{selectedItem.progress}%</p>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={selectedItem.progress}
                    onChange={(e) => handleUpdateProgress(selectedItem.id, Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">处理备注</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto mb-3">
                    {selectedItem.remarks.length === 0 ? (
                      <p className="text-sm text-gray-400 text-center py-4">暂无备注</p>
                    ) : (
                      selectedItem.remarks.map((remark, index) => (
                        <div key={index} className="p-2 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-700">{remark}</p>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="添加备注..."
                      value={newRemark}
                      onChange={(e) => setNewRemark(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddRemark()}
                      className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm"
                    />
                    <button
                      onClick={handleAddRemark}
                      className="rounded-lg bg-primary-600 px-3 py-2 text-white hover:bg-primary-700"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl bg-white p-12 shadow-sm border border-gray-100 text-center">
              <ClipboardList className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">选择一个处置事项查看详情</p>
            </div>
          )}
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl bg-white p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">新增处置事项</h2>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">事项标题</label>
                <input type="text" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">关联预警</label>
                <select className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm">
                  <option value="">无关联预警</option>
                  {warnings.filter((w) => !w.isHandled).map((w) => (
                    <option key={w.id} value={w.id}>{w.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">责任人</label>
                <input type="text" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">事项描述</label>
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
