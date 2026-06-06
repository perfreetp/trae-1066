import { useState, useEffect, useRef } from 'react';
import {
  Edit3,
  Save,
  Eye,
  FileText,
  AlertTriangle,
  CheckCircle,
  History,
  RefreshCw,
  Copy,
  Download,
  ChevronDown,
  X,
  User,
  Clock,
  GitCompare,
} from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useStore } from '@/store/useStore';
import { checkSensitiveWords, highlightSensitiveWords } from '@/utils/sensitiveCheck';
import { generateSimplePDF } from '@/utils/pdfGenerator';
import { cn } from '@/lib/utils';
import * as Diff from 'diff';

export default function ReportEditor() {
  const [content, setContent] = useState('');
  const [leaderComments, setLeaderComments] = useState('');
  const [showSensitiveCheck, setShowSensitiveCheck] = useState(false);
  const [sensitiveMatches, setSensitiveMatches] = useState<any[]>([]);
  const [showVersionCompare, setShowVersionCompare] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<number | null>(null);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving'>('saved');
  const [showPreview, setShowPreview] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  const currentReport = useStore((state) => state.currentReport);
  const updateReport = useStore((state) => state.updateReport);
  const addReportVersion = useStore((state) => state.addReportVersion);
  const systemConfig = useStore((state) => state.systemConfig);

  useEffect(() => {
    setContent(currentReport.content);
    setLeaderComments(currentReport.leaderComments);
  }, [currentReport]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAutoSaveStatus('saving');
      setTimeout(() => {
        updateReport({ content, leaderComments });
        setAutoSaveStatus('saved');
      }, 500);
    }, 1000);
    return () => clearTimeout(timer);
  }, [content, leaderComments, updateReport]);

  const handleSensitiveCheck = () => {
    const plainText = content.replace(/<[^>]*>/g, '');
    const matches = checkSensitiveWords(plainText, systemConfig.sensitiveWords);
    setSensitiveMatches(matches);
    setShowSensitiveCheck(true);
  };

  const handleSaveVersion = () => {
    const newVersion = {
      version: currentReport.versions.length + 1,
      content,
      createTime: new Date().toISOString().slice(0, 16).replace('T', ' '),
      creator: '张三',
      changeLog: '保存新版本',
    };
    addReportVersion(newVersion);
  };

  const handleGeneratePDF = () => {
    generateSimplePDF(currentReport.title, content, currentReport.title);
  };

  const getVersionDiff = (oldContent: string, newContent: string) => {
    const diff = Diff.diffChars(oldContent.replace(/<[^>]*>/g, ''), newContent.replace(/<[^>]*>/g, ''));
    return diff.map((part, index) => (
      <span
        key={index}
        className={cn(
          part.added && 'bg-green-100 text-green-700',
          part.removed && 'bg-red-100 text-red-700 line-through'
        )}
      >
        {part.value}
      </span>
    ));
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ align: [] }],
      ['link'],
      ['clean'],
    ],
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">日报编辑</h1>
          <p className="mt-1 text-sm text-gray-500">编辑防汛值班日报，支持敏感词检查和版本管理</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            {autoSaveStatus === 'saved' ? (
              <>
                <CheckCircle className="h-4 w-4 text-green-500" />
                已自动保存
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                保存中...
              </>
            )}
          </div>
          <button
            onClick={handleSensitiveCheck}
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-50"
          >
            <AlertTriangle className="h-4 w-4 text-orange-500" />
            敏感词检查
          </button>
          <button
            onClick={() => setShowVersionCompare(true)}
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-50"
          >
            <GitCompare className="h-4 w-4" />
            版本对比
          </button>
          <button
            onClick={() => setShowPreview(true)}
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-50"
          >
            <Eye className="h-4 w-4" />
            预览
          </button>
          <button
            onClick={handleSaveVersion}
            className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
          >
            <Save className="h-4 w-4" />
            保存版本
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3 space-y-6">
          <div className="rounded-xl bg-white shadow-sm border border-gray-100">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
                    <Edit3 className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">{currentReport.title}</h2>
                    <p className="text-xs text-gray-500">
                      创建于 {currentReport.createTime} · 版本 {currentReport.versions.length}
                    </p>
                  </div>
                </div>
                <span className={cn(
                  'px-2 py-1 rounded text-xs font-medium',
                  currentReport.status === 'draft' ? 'bg-gray-100 text-gray-700' :
                  currentReport.status === 'reviewing' ? 'bg-yellow-100 text-yellow-700' :
                  currentReport.status === 'finalized' ? 'bg-green-100 text-green-700' :
                  'bg-blue-100 text-blue-700'
                )}>
                  {currentReport.status === 'draft' ? '草稿' :
                   currentReport.status === 'reviewing' ? '审核中' :
                   currentReport.status === 'finalized' ? '已定稿' : '已归档'}
                </span>
              </div>
            </div>
            <div className="p-4">
              <div className="min-h-[500px]">
                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  modules={modules}
                  placeholder="开始编辑日报内容..."
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white shadow-sm border border-gray-100">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                  <User className="h-4 w-4" />
                </div>
                <h3 className="font-semibold text-gray-900">领导批示</h3>
              </div>
            </div>
            <div className="p-4">
              <textarea
                value={leaderComments}
                onChange={(e) => setLeaderComments(e.target.value)}
                placeholder="在此输入领导批示内容..."
                className="w-full h-24 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 resize-none"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-3">快捷操作</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-2 rounded-lg p-2 text-sm hover:bg-gray-50 text-left">
                <FileText className="h-4 w-4 text-gray-400" />
                从模板创建
              </button>
              <button
                onClick={handleGeneratePDF}
                className="w-full flex items-center gap-2 rounded-lg p-2 text-sm hover:bg-gray-50 text-left"
              >
                <Download className="h-4 w-4 text-gray-400" />
                导出PDF
              </button>
              <button className="w-full flex items-center gap-2 rounded-lg p-2 text-sm hover:bg-gray-50 text-left">
                <Copy className="h-4 w-4 text-gray-400" />
                复制内容
              </button>
            </div>
          </div>

          <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-3">版本历史</h3>
            <div className="space-y-3">
              {currentReport.versions.slice().reverse().map((version) => (
                <div
                  key={version.version}
                  onClick={() => setSelectedVersion(version.version)}
                  className={cn(
                    'p-3 rounded-lg border cursor-pointer transition-colors',
                    selectedVersion === version.version
                      ? 'border-primary-300 bg-primary-50'
                      : 'border-gray-100 hover:border-gray-200'
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">版本 {version.version}</span>
                    <History className="h-4 w-4 text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-500">{version.createTime}</p>
                  <p className="text-xs text-gray-500">{version.creator}</p>
                </div>
              ))}
            </div>
          </div>

          {showSensitiveCheck && (
            <div className="rounded-xl bg-white p-4 shadow-sm border border-warning-red/30">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-warning-red" />
                  敏感词检查结果
                </h3>
                <button onClick={() => setShowSensitiveCheck(false)} className="p-1 text-gray-400 hover:text-gray-600">
                  <X className="h-4 w-4" />
                </button>
              </div>
              {sensitiveMatches.length === 0 ? (
                <div className="text-center py-4">
                  <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="text-sm text-green-600">未检测到敏感词</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">检测到 <span className="font-bold text-warning-red">{sensitiveMatches.length}</span> 处敏感词：</p>
                  {sensitiveMatches.map((match, index) => (
                    <div key={index} className="p-2 bg-red-50 rounded text-sm">
                      <span className="font-medium text-warning-red">{match.word}</span>
                      <span className="text-gray-500 text-xs ml-2">位置：第{match.index}字符</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-4xl max-h-[90vh] rounded-xl bg-white overflow-hidden animate-slide-up">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">报告预览</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleGeneratePDF}
                  className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
                >
                  <Download className="h-4 w-4" />
                  导出PDF
                </button>
                <button onClick={() => setShowPreview(false)} className="p-2 text-gray-400 hover:text-gray-600">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="p-8 overflow-y-auto max-h-[calc(90vh-80px)]">
              <div id="report-preview" className="max-w-3xl mx-auto">
                <h1 className="text-2xl font-bold text-center mb-6">{currentReport.title}</h1>
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
                {leaderComments && (
                  <div className="mt-8 p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <p className="text-sm font-medium text-orange-800 mb-2">领导批示：</p>
                    <p className="text-sm text-orange-700">{leaderComments}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showVersionCompare && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-4xl max-h-[90vh] rounded-xl bg-white overflow-hidden animate-slide-up">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">版本对比</h2>
              <button onClick={() => setShowVersionCompare(false)} className="p-2 text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">对比版本</label>
                  <select
                    value={selectedVersion || ''}
                    onChange={(e) => setSelectedVersion(Number(e.target.value))}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  >
                    <option value="">选择版本</option>
                    {currentReport.versions.map((v) => (
                      <option key={v.version} value={v.version}>
                        版本 {v.version} - {v.createTime}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {selectedVersion && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {getVersionDiff(
                      currentReport.versions.find((v) => v.version === selectedVersion)?.content || '',
                      content
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
