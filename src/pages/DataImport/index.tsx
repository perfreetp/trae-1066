import { useState, useCallback } from 'react';
import { Upload, FileSpreadsheet, FileText, Image, X, CheckCircle, AlertCircle, ChevronDown, Settings } from 'lucide-react';
import { parseExcelFile, detectFileType, mapToRainfallStations, mapToWaterLevelStations } from '@/utils/fileParser';
import { useStore } from '@/store/useStore';
import type { ImportedFile } from '@/types';
import { cn } from '@/lib/utils';

export default function DataImport() {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('auto');
  const [selectedBasin, setSelectedBasin] = useState<string>('');
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showBasinDropdown, setShowBasinDropdown] = useState(false);

  const importedFiles = useStore((state) => state.importedFiles);
  const addImportedFile = useStore((state) => state.addImportedFile);
  const updateImportedFile = useStore((state) => state.updateImportedFile);
  const setRainfallStations = useStore((state) => state.setRainfallStations);
  const setWaterLevelStations = useStore((state) => state.setWaterLevelStations);
  const systemConfig = useStore((state) => state.systemConfig);
  const rainfallStations = useStore((state) => state.rainfallStations);
  const waterLevelStations = useStore((state) => state.waterLevelStations);

  const fileTypes = [
    { value: 'auto', label: '自动识别', icon: Settings },
    { value: 'rainfall', label: '雨量数据', icon: FileSpreadsheet },
    { value: 'waterLevel', label: '水位数据', icon: FileText },
    { value: 'reservoir', label: '水库数据', icon: FileSpreadsheet },
    { value: 'pump', label: '泵站数据', icon: FileSpreadsheet },
  ];

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    files.forEach(handleFile);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(handleFile);
  };

  const handleFile = async (file: File) => {
    const fileId = `file_${Date.now()}`;
    const importedFile: ImportedFile = {
      id: fileId,
      name: file.name,
      type: file.type,
      size: file.size,
      uploadTime: new Date().toISOString().slice(0, 16).replace('T', ' '),
      status: 'uploading',
    };
    addImportedFile(importedFile);

    try {
      let data: any[] = [];
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv')) {
        data = await parseExcelFile(file);
      }

      let detectedType = selectedType;
      if (detectedType === 'auto') {
        detectedType = detectFileType(file.name);
      }

      if (detectedType === 'rainfall') {
        const result = mapToRainfallStations(data, selectedBasin ? { '': selectedBasin } : undefined);
        if (result.success) {
          setRainfallStations([...rainfallStations, ...result.data]);
        }
      } else if (detectedType === 'waterLevel') {
        const result = mapToWaterLevelStations(data, selectedBasin ? { '': selectedBasin } : undefined);
        if (result.success) {
          setWaterLevelStations([...waterLevelStations, ...result.data]);
        }
      }

      setPreviewData(data.slice(0, 5));
      updateImportedFile(fileId, { status: 'success', data });
    } catch (error) {
      updateImportedFile(fileId, { status: 'error' });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls') || fileName.endsWith('.csv')) {
      return <FileSpreadsheet className="h-6 w-6 text-green-600" />;
    }
    if (fileName.endsWith('.doc') || fileName.endsWith('.docx')) {
      return <FileText className="h-6 w-6 text-blue-600" />;
    }
    if (fileName.match(/\.(jpg|jpeg|png|gif)$/i)) {
      return <Image className="h-6 w-6 text-purple-600" />;
    }
    return <FileText className="h-6 w-6 text-gray-600" />;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">资料导入</h1>
        <p className="mt-1 text-sm text-gray-500">上传雨量、水位、水库、泵站等数据文件</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">上传设置</h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">数据类型</label>
                <button
                  onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                  className="w-full flex items-center justify-between rounded-lg border border-gray-200 px-4 py-2.5 text-left hover:border-gray-300 transition-colors"
                >
                  <span className="text-sm text-gray-900">
                    {fileTypes.find((t) => t.value === selectedType)?.label}
                  </span>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>
                {showTypeDropdown && (
                  <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
                    {fileTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <button
                          key={type.value}
                          onClick={() => {
                            setSelectedType(type.value);
                            setShowTypeDropdown(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-left"
                        >
                          <Icon className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-700">{type.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">所属流域</label>
                <button
                  onClick={() => setShowBasinDropdown(!showBasinDropdown)}
                  className="w-full flex items-center justify-between rounded-lg border border-gray-200 px-4 py-2.5 text-left hover:border-gray-300 transition-colors"
                >
                  <span className="text-sm text-gray-900">{selectedBasin || '自动识别'}</span>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>
                {showBasinDropdown && (
                  <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg max-h-48 overflow-y-auto">
                    <button
                      onClick={() => {
                        setSelectedBasin('');
                        setShowBasinDropdown(false);
                      }}
                      className="w-full px-4 py-2.5 hover:bg-gray-50 text-left text-sm text-gray-700"
                    >
                      自动识别
                    </button>
                    {systemConfig.basins.map((basin) => (
                      <button
                        key={basin}
                        onClick={() => {
                          setSelectedBasin(basin);
                          setShowBasinDropdown(false);
                        }}
                        className="w-full px-4 py-2.5 hover:bg-gray-50 text-left text-sm text-gray-700"
                      >
                        {basin}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                'relative rounded-xl border-2 border-dashed p-12 text-center transition-all duration-200 cursor-pointer',
                isDragging
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
              )}
            >
              <input
                type="file"
                multiple
                accept=".xlsx,.xls,.csv,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleFileInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-primary-600 mb-4">
                  <Upload className="h-8 w-8" />
                </div>
                <p className="text-lg font-medium text-gray-900 mb-2">拖拽文件到此处上传</p>
                <p className="text-sm text-gray-500 mb-4">或点击选择文件</p>
                <p className="text-xs text-gray-400">支持 Excel、CSV、Word、图片格式</p>
              </div>
            </div>
          </div>

          {previewData.length > 0 && (
            <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">数据预览</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      {Object.keys(previewData[0]).map((key) => (
                        <th key={key} className="px-4 py-3 text-left font-medium text-gray-700 bg-gray-50">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.map((row, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        {Object.values(row).map((value, i) => (
                          <td key={i} className="px-4 py-3 text-gray-600">
                            {String(value)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">已上传文件</h2>
            {importedFiles.length === 0 ? (
              <div className="text-center py-8">
                <FileSpreadsheet className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">暂无上传文件</p>
              </div>
            ) : (
              <div className="space-y-3">
                {importedFiles.map((file) => (
                  <div key={file.id} className="flex items-center gap-3 rounded-lg border border-gray-100 p-3">
                    {getFileIcon(file.name)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                    {file.status === 'success' && (
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    )}
                    {file.status === 'error' && (
                      <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                    )}
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-xl bg-gradient-to-br from-secondary-50 to-blue-50 p-6 border border-secondary-100">
            <h3 className="font-semibold text-gray-900 mb-3">上传说明</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-secondary-500">•</span>
                Excel文件第一行为表头，包含站点名称、流域、数值等列
              </li>
              <li className="flex items-start gap-2">
                <span className="text-secondary-500">•</span>
                文件名包含"雨量""水位""水库""泵站"等关键词可自动识别
              </li>
              <li className="flex items-start gap-2">
                <span className="text-secondary-500">•</span>
                支持批量上传多个文件
              </li>
              <li className="flex items-start gap-2">
                <span className="text-secondary-500">•</span>
                单个文件大小不超过50MB
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
