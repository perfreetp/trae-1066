import { useState } from 'react';
import {
  Settings,
  Bell,
  AlertTriangle,
  Globe,
  Clock,
  Save,
  Plus,
  X,
  User,
  Lock,
  Database,
  Info,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'basic' | 'warning' | 'reminder' | 'sensitive' | 'about'>('basic');
  const systemConfig = useStore((state) => state.systemConfig);
  const updateSystemConfig = useStore((state) => state.updateSystemConfig);

  const [basinInput, setBasinInput] = useState('');
  const [sensitiveInput, setSensitiveInput] = useState('');
  const [localConfig, setLocalConfig] = useState(systemConfig);
  const [showSaveTip, setShowSaveTip] = useState(false);

  const handleSave = () => {
    updateSystemConfig(localConfig);
    setShowSaveTip(true);
    setTimeout(() => setShowSaveTip(false), 2000);
  };

  const addBasin = () => {
    if (basinInput.trim() && !localConfig.basins.includes(basinInput.trim())) {
      setLocalConfig((prev) => ({
        ...prev,
        basins: [...prev.basins, basinInput.trim()],
      }));
      setBasinInput('');
    }
  };

  const removeBasin = (basin: string) => {
    setLocalConfig((prev) => ({
      ...prev,
      basins: prev.basins.filter((b) => b !== basin),
    }));
  };

  const addSensitiveWord = () => {
    if (sensitiveInput.trim() && !localConfig.sensitiveWords.includes(sensitiveInput.trim())) {
      setLocalConfig((prev) => ({
        ...prev,
        sensitiveWords: [...prev.sensitiveWords, sensitiveInput.trim()],
      }));
      setSensitiveInput('');
    }
  };

  const removeSensitiveWord = (word: string) => {
    setLocalConfig((prev) => ({
      ...prev,
      sensitiveWords: prev.sensitiveWords.filter((w) => w !== word),
    }));
  };

  const tabs = [
    { key: 'basic', label: '基础设置', icon: Settings },
    { key: 'warning', label: '预警阈值', icon: AlertTriangle },
    { key: 'reminder', label: '定时提醒', icon: Bell },
    { key: 'sensitive', label: '敏感词库', icon: Lock },
    { key: 'about', label: '关于系统', icon: Info },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">系统设置</h1>
          <p className="mt-1 text-sm text-gray-500">配置系统参数和个性化选项</p>
        </div>
        <div className="flex items-center gap-3">
          {showSaveTip && (
            <span className="text-sm text-green-600 flex items-center gap-1">
              <Save className="h-4 w-4" />
              保存成功
            </span>
          )}
          <button
            onClick={handleSave}
            className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
          >
            <Save className="h-4 w-4" />
            保存设置
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-56 flex-shrink-0">
          <div className="rounded-xl bg-white shadow-sm border border-gray-100 p-2">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    activeTab === tab.key
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="flex-1">
          <div className="rounded-xl bg-white shadow-sm border border-gray-100 p-6">
            {activeTab === 'basic' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">基础配置</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">系统名称</label>
                        <input
                          type="text"
                          defaultValue="防汛值班日报自动化系统"
                          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">单位名称</label>
                        <input
                          type="text"
                          defaultValue="市水利局防汛办公室"
                          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">流域管理</label>
                      <div className="flex gap-2 mb-3">
                        <input
                          type="text"
                          placeholder="输入流域名称"
                          value={basinInput}
                          onChange={(e) => setBasinInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && addBasin()}
                          className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                        />
                        <button
                          onClick={addBasin}
                          className="flex items-center gap-1 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                          添加
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {localConfig.basins.map((basin) => (
                          <span
                            key={basin}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm"
                          >
                            <Globe className="h-3.5 w-3.5" />
                            {basin}
                            <button
                              onClick={() => removeBasin(basin)}
                              className="ml-1 hover:text-blue-900"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'warning' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">雨量预警阈值设置</h3>
                  <p className="text-sm text-gray-500 mb-4">设置不同预警级别的雨量阈值（单位：毫米）</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                      <label className="block text-sm font-medium text-yellow-800 mb-2">
                        关注级 (Attention)
                      </label>
                      <input
                        type="number"
                        value={localConfig.rainfallWarning.attention}
                        onChange={(e) =>
                          setLocalConfig((prev) => ({
                            ...prev,
                            rainfallWarning: {
                              ...prev.rainfallWarning,
                              attention: Number(e.target.value),
                            },
                          }))
                        }
                        className="w-full rounded-lg border border-yellow-300 px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 bg-white"
                      />
                      <p className="text-xs text-yellow-600 mt-1">超过此值触发关注提醒</p>
                    </div>
                    <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
                      <label className="block text-sm font-medium text-orange-800 mb-2">
                        预警级 (Warning)
                      </label>
                      <input
                        type="number"
                        value={localConfig.rainfallWarning.warning}
                        onChange={(e) =>
                          setLocalConfig((prev) => ({
                            ...prev,
                            rainfallWarning: {
                              ...prev.rainfallWarning,
                              warning: Number(e.target.value),
                            },
                          }))
                        }
                        className="w-full rounded-lg border border-orange-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 bg-white"
                      />
                      <p className="text-xs text-orange-600 mt-1">超过此值触发预警</p>
                    </div>
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                      <label className="block text-sm font-medium text-red-800 mb-2">
                        紧急级 (Emergency)
                      </label>
                      <input
                        type="number"
                        value={localConfig.rainfallWarning.emergency}
                        onChange={(e) =>
                          setLocalConfig((prev) => ({
                            ...prev,
                            rainfallWarning: {
                              ...prev.rainfallWarning,
                              emergency: Number(e.target.value),
                            },
                          }))
                        }
                        className="w-full rounded-lg border border-red-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 bg-white"
                      />
                      <p className="text-xs text-red-600 mt-1">超过此值触发紧急预警</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reminder' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">定时提醒设置</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                          <Clock className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">日报提交提醒</p>
                          <p className="text-sm text-gray-500">每日固定时间提醒提交值班日报</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <input
                          type="time"
                          value={localConfig.reminderTime}
                          onChange={(e) =>
                            setLocalConfig((prev) => ({
                              ...prev,
                              reminderTime: e.target.value,
                            }))
                          }
                          className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
                        />
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                          <AlertTriangle className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">预警实时提醒</p>
                          <p className="text-sm text-gray-500">收到新预警时立即弹出通知</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600">
                          <Bell className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">声音提醒</p>
                          <p className="text-sm text-gray-500">收到重要通知时播放提示音</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'sensitive' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">敏感词库管理</h3>
                  <p className="text-sm text-gray-500 mb-4">添加需要检查的敏感词汇，系统会在编辑报告时自动检测</p>
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      placeholder="输入敏感词"
                      value={sensitiveInput}
                      onChange={(e) => setSensitiveInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addSensitiveWord()}
                      className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                    />
                    <button
                      onClick={addSensitiveWord}
                      className="flex items-center gap-1 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      添加
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {localConfig.sensitiveWords.map((word) => (
                      <span
                        key={word}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-sm"
                      >
                        {word}
                        <button
                          onClick={() => removeSensitiveWord(word)}
                          className="ml-1 hover:text-red-900"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </span>
                    ))}
                    {localConfig.sensitiveWords.length === 0 && (
                      <span className="text-sm text-gray-400">暂无敏感词</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'about' && (
              <div className="space-y-6">
                <div className="text-center py-8">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-white mx-auto mb-4">
                    <Database className="h-10 w-10" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">防汛值班日报自动化系统</h3>
                  <p className="text-sm text-gray-500 mt-1">版本 1.0.0</p>
                </div>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-gray-50">
                    <h4 className="font-medium text-gray-900 mb-2">系统功能</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• 多源数据导入与解析</li>
                      <li>• 雨水情数据自动核对</li>
                      <li>• 重点摘要自动生成</li>
                      <li>• 预警清单管理</li>
                      <li>• 处置事项跟踪</li>
                      <li>• 日报在线编辑与修订</li>
                      <li>• 报告分发与归档</li>
                      <li>• PDF生成与导出</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-lg bg-gray-50">
                    <h4 className="font-medium text-gray-900 mb-2">技术支持</h4>
                    <p className="text-sm text-gray-600">
                      如有系统使用问题，请联系技术支持团队。
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      联系电话：400-XXX-XXXX
                    </p>
                    <p className="text-sm text-gray-500">
                      邮箱：support@water.gov.cn
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
