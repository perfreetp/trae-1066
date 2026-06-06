import { useState } from 'react';
import {
  Archive,
  Send,
  FileText,
  Download,
  Search,
  Filter,
  Calendar,
  User,
  ChevronDown,
  Eye,
  Trash2,
  Paperclip,
  Mail,
  MessageSquare,
  CheckCircle,
  Clock,
  X,
  Plus,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import type { DailyReport, ReportStatus } from '@/types';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';
import { generatePDF } from '@/utils/pdfGenerator';

const mockArchivedReports: DailyReport[] = [
  {
    id: '1',
    date: '2024-06-20',
    title: '防汛值班日报（2024年6月20日）',
    content: '<p>今日雨情平稳...</p>',
    leaderComments: '<p>请各单位继续做好值班工作。</p>',
    versions: [],
    status: 'archived',
    createTime: '2024-06-20 17:00',
    updateTime: '2024-06-20 17:30',
    creator: '张三',
  },
  {
    id: '2',
    date: '2024-06-19',
    title: '防汛值班日报（2024年6月19日）',
    content: '<p>今日局部地区有大雨...</p>',
    leaderComments: '<p>重点关注东部流域。</p>',
    versions: [],
    status: 'archived',
    createTime: '2024-06-19 17:00',
    updateTime: '2024-06-19 17:20',
    creator: '李四',
  },
  {
    id: '3',
    date: '2024-06-18',
    title: '防汛值班日报（2024年6月18日）',
    content: '<p>今日晴转多云...</p>',
    leaderComments: '',
    versions: [],
    status: 'archived',
    createTime: '2024-06-18 17:00',
    updateTime: '2024-06-18 17:15',
    creator: '张三',
  },
];

const mockRecipients = [
  { id: '1', name: '王局长', department: '局领导', email: 'wang@water.gov.cn', phone: '138****1001' },
  { id: '2', name: '李副局长', department: '局领导', email: 'li@water.gov.cn', phone: '138****1002' },
  { id: '3', name: '张科长', department: '防汛办', email: 'zhang@water.gov.cn', phone: '138****1003' },
  { id: '4', name: '刘主任', department: '值班室', email: 'liu@water.gov.cn', phone: '138****1004' },
  { id: '5', name: '陈站长', department: '水文站', email: 'chen@water.gov.cn', phone: '138****1005' },
];

const mockAttachments = [
  { id: '1', name: '雨量站数据.xlsx', size: '245KB', uploadTime: '2024-06-20 16:30' },
  { id: '2', name: '水位监测表.csv', size: '128KB', uploadTime: '2024-06-20 16:35' },
  { id: '3', name: '现场照片.jpg', size: '2.3MB', uploadTime: '2024-06-20 16:40' },
];

export default function ArchivePage() {
  const [activeTab, setActiveTab] = useState<'distribute' | 'archive' | 'attachments'>('distribute');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [showSendModal, setShowSendModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<DailyReport | null>(null);
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const [sendMethod, setSendMethod] = useState<'email' | 'sms' | 'both'>('email');

  const currentReport = useStore((state) => state.currentReport);

  const getStatusBadge = (status: ReportStatus) => {
    switch (status) {
      case 'draft':
        return (
          <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
            草稿
          </span>
        );
      case 'reviewing':
        return (
          <span className="px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-700">
            审核中
          </span>
        );
      case 'finalized':
        return (
          <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700">
            已定稿
          </span>
        );
      case 'archived':
        return (
          <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">
            已归档
          </span>
        );
    }
  };

  const filteredReports = mockArchivedReports.filter((report) => {
    if (searchQuery && !report.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (statusFilter !== 'all' && report.status !== statusFilter) return false;
    if (dateRange.start && report.date < dateRange.start) return false;
    if (dateRange.end && report.date > dateRange.end) return false;
    return true;
  });

  const handleSend = () => {
    setShowSendModal(true);
  };

  const handleConfirmSend = () => {
    alert(`已通过${sendMethod === 'email' ? '邮件' : sendMethod === 'sms' ? '短信' : '邮件和短信'}发送给${selectedRecipients.length}位收件人`);
    setShowSendModal(false);
    setSelectedRecipients([]);
  };

  const handlePreview = (report: DailyReport) => {
    setSelectedReport(report);
    setShowPreviewModal(true);
  };

  const handleDownloadPDF = async (report: DailyReport) => {
    alert(`正在下载 ${report.title} 的PDF文件...`);
  };

  const handleExportPDF = async () => {
    try {
      await generatePDF('report-content', '防汛值班日报');
    } catch (error) {
      console.error('PDF生成失败:', error);
    }
  };

  const toggleRecipient = (id: string) => {
    setSelectedRecipients((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const selectAllRecipients = () => {
    if (selectedRecipients.length === mockRecipients.length) {
      setSelectedRecipients([]);
    } else {
      setSelectedRecipients(mockRecipients.map((r) => r.id));
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">分发归档</h1>
          <p className="mt-1 text-sm text-gray-500">报告分发、历史归档和附件管理</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <Download className="h-4 w-4" />
            导出PDF
          </button>
          <button
            onClick={handleSend}
            className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
          >
            <Send className="h-4 w-4" />
            发送报告
          </button>
        </div>
      </div>

      <div className="rounded-xl bg-white shadow-sm border border-gray-100">
        <div className="border-b border-gray-100">
          <div className="flex">
            {[
              { key: 'distribute', label: '报告分发', icon: Send },
              { key: 'archive', label: '历史归档', icon: Archive },
              { key: 'attachments', label: '附件管理', icon: Paperclip },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={cn(
                  'flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors',
                  activeTab === tab.key
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                )}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'distribute' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 p-4 border border-blue-200">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500 text-white">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-blue-600">待发送报告</p>
                      <p className="text-2xl font-bold text-blue-700">1</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-green-50 to-green-100 p-4 border border-green-200">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500 text-white">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-green-600">今日已发送</p>
                      <p className="text-2xl font-bold text-green-700">5</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 p-4 border border-purple-200">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500 text-white">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-purple-600">收件人数量</p>
                      <p className="text-2xl font-bold text-purple-700">{mockRecipients.length}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-4">当前报告</h3>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{currentReport.title}</p>
                      <p className="text-sm text-gray-500">创建于 {currentReport.createTime} · {currentReport.creator}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(currentReport.status)}
                    <button
                      onClick={() => handlePreview(currentReport)}
                      className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={handleExportPDF}
                      className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-700">收件人列表</h3>
                  <button
                    onClick={selectAllRecipients}
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    {selectedRecipients.length === mockRecipients.length ? '取消全选' : '全选'}
                  </button>
                </div>
                <div className="space-y-2">
                  {mockRecipients.map((recipient) => (
                    <div
                      key={recipient.id}
                      onClick={() => toggleRecipient(recipient.id)}
                      className={cn(
                        'flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors border',
                        selectedRecipients.includes(recipient.id)
                          ? 'bg-primary-50 border-primary-200'
                          : 'bg-white border-gray-200 hover:bg-gray-50'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          'h-5 w-5 rounded border flex items-center justify-center transition-colors',
                          selectedRecipients.includes(recipient.id)
                            ? 'bg-primary-600 border-primary-600'
                            : 'border-gray-300'
                        )}>
                          {selectedRecipients.includes(recipient.id) && (
                            <CheckCircle className="h-3 w-3 text-white" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{recipient.name}</p>
                          <p className="text-sm text-gray-500">{recipient.department}</p>
                        </div>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        <p>{recipient.email}</p>
                        <p>{recipient.phone}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'archive' && (
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="搜索报告..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="rounded-lg border border-gray-200 py-2 px-3 text-sm"
                  >
                    <option value="all">全部状态</option>
                    <option value="draft">草稿</option>
                    <option value="reviewing">审核中</option>
                    <option value="finalized">已定稿</option>
                    <option value="archived">已归档</option>
                  </select>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <input
                      type="date"
                      value={dateRange.start}
                      onChange={(e) => setDateRange((prev) => ({ ...prev, start: e.target.value }))}
                      className="rounded-lg border border-gray-200 py-2 px-3 text-sm"
                    />
                    <span className="text-gray-400">至</span>
                    <input
                      type="date"
                      value={dateRange.end}
                      onChange={(e) => setDateRange((prev) => ({ ...prev, end: e.target.value }))}
                      className="rounded-lg border border-gray-200 py-2 px-3 text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">报告名称</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">日期</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">创建人</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">更新时间</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredReports.map((report) => (
                      <tr key={report.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-gray-400" />
                            <span className="font-medium text-gray-900">{report.title}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{report.date}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{report.creator}</td>
                        <td className="px-4 py-3">{getStatusBadge(report.status)}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{report.updateTime}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handlePreview(report)}
                              className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded transition-colors"
                              title="预览"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDownloadPDF(report)}
                              className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded transition-colors"
                              title="下载"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'attachments' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-700">附件列表</h3>
                <button className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-sm hover:bg-gray-50 transition-colors">
                  <Plus className="h-4 w-4" />
                  上传附件
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockAttachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="rounded-xl border border-gray-200 p-4 hover:border-primary-200 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600 flex-shrink-0">
                        <Paperclip className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{attachment.name}</p>
                        <p className="text-xs text-gray-500 mt-1">{attachment.size} · {attachment.uploadTime}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-gray-100">
                      <button className="p-1.5 text-gray-400 hover:text-primary-600 rounded transition-colors">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-primary-600 rounded transition-colors">
                        <Download className="h-4 w-4" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-red-600 rounded transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {showSendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl bg-white p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">发送报告</h2>
              <button onClick={() => setShowSendModal(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">发送方式</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: 'email', label: '邮件', icon: Mail },
                    { key: 'sms', label: '短信', icon: MessageSquare },
                    { key: 'both', label: '全部', icon: Send },
                  ].map((method) => (
                    <button
                      key={method.key}
                      onClick={() => setSendMethod(method.key as any)}
                      className={cn(
                        'flex flex-col items-center gap-1 p-3 rounded-lg border transition-colors',
                        sendMethod === method.key
                          ? 'border-primary-500 bg-primary-50 text-primary-600'
                          : 'border-gray-200 hover:bg-gray-50'
                      )}
                    >
                      <method.icon className="h-5 w-5" />
                      <span className="text-xs font-medium">{method.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  已选收件人 ({selectedRecipients.length}人)
                </label>
                <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg min-h-[60px]">
                  {selectedRecipients.length > 0 ? (
                    selectedRecipients.map((id) => {
                      const recipient = mockRecipients.find((r) => r.id === id);
                      return recipient ? (
                        <span
                          key={id}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs"
                        >
                          {recipient.name}
                          <button
                            onClick={() => toggleRecipient(id)}
                            className="hover:text-primary-900"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ) : null;
                    })
                  ) : (
                    <span className="text-sm text-gray-400">请从左侧列表选择收件人</span>
                  )}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowSendModal(false)}
                  className="flex-1 rounded-lg border border-gray-200 py-2 text-sm font-medium hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  onClick={handleConfirmSend}
                  disabled={selectedRecipients.length === 0}
                  className={cn(
                    'flex-1 rounded-lg py-2 text-sm font-medium text-white transition-colors',
                    selectedRecipients.length > 0
                      ? 'bg-primary-600 hover:bg-primary-700'
                      : 'bg-gray-300 cursor-not-allowed'
                  )}
                >
                  确认发送
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPreviewModal && selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-4xl max-h-[90vh] rounded-xl bg-white overflow-hidden animate-slide-up">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">{selectedReport.title}</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadPDF(selectedReport)}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                >
                  <Download className="h-4 w-4" />
                  下载PDF
                </button>
                <button onClick={() => setShowPreviewModal(false)} className="p-1 text-gray-400 hover:text-gray-600">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-70px)]">
              <div id="report-content" className="prose prose-sm max-w-none">
                <h1 className="text-xl font-bold text-center mb-6">{selectedReport.title}</h1>
                <div className="text-sm text-gray-500 text-center mb-6">
                  报告日期：{selectedReport.date} | 创建人：{selectedReport.creator}
                </div>
                <div className="border-t border-b border-gray-200 py-4 mb-6">
                  <h3 className="font-semibold mb-2">一、雨水情概况</h3>
                  <p className="text-gray-700">今日全市平均降雨量12.5mm，最大点降雨量出现在XX站，为45.2mm。主要河流水位平稳，未超警戒水位。</p>
                </div>
                <div className="border-b border-gray-200 py-4 mb-6">
                  <h3 className="font-semibold mb-2">二、工程运行情况</h3>
                  <p className="text-gray-700">全市水库运行正常，其中3座水库水位接近汛限水位，已加强巡查。泵站运行正常，累计排涝120万立方米。</p>
                </div>
                <div className="border-b border-gray-200 py-4 mb-6">
                  <h3 className="font-semibold mb-2">三、预警与处置</h3>
                  <p className="text-gray-700">今日发布蓝色预警2次，已全部处置完毕。未发生重大险情。</p>
                </div>
                {selectedReport.leaderComments && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold mb-2 text-yellow-800">领导批示</h3>
                    <p className="text-yellow-700">{selectedReport.leaderComments.replace(/<[^>]*>/g, '')}</p>
                  </div>
                )}
                <div className="text-right text-sm text-gray-500 mt-8">
                  <p>生成时间：{selectedReport.updateTime}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
