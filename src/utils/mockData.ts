import dayjs from 'dayjs';
import type {
  RainfallStation,
  WaterLevelStation,
  Reservoir,
  PumpStation,
  WarningItem,
  DisposalItem,
  DailyReport,
  SystemConfig,
} from '@/types';

const BASINS = ['长江流域', '黄河流域', '珠江流域', '淮河流域', '海河流域'];

export const mockRainfallStations: RainfallStation[] = [
  { id: 'r1', name: '武汉站', basin: '长江流域', rainfall: 125.6, oneHourRain: 28.3, warningLevel: 'warning', updateTime: dayjs().format('YYYY-MM-DD HH:mm') },
  { id: 'r2', name: '南京站', basin: '长江流域', rainfall: 89.2, oneHourRain: 15.6, warningLevel: 'attention', updateTime: dayjs().format('YYYY-MM-DD HH:mm') },
  { id: 'r3', name: '重庆站', basin: '长江流域', rainfall: 156.8, oneHourRain: 42.1, warningLevel: 'emergency', updateTime: dayjs().format('YYYY-MM-DD HH:mm') },
  { id: 'r4', name: '郑州站', basin: '黄河流域', rainfall: 45.3, oneHourRain: 8.2, warningLevel: 'normal', updateTime: dayjs().format('YYYY-MM-DD HH:mm') },
  { id: 'r5', name: '济南站', basin: '黄河流域', rainfall: 67.5, oneHourRain: 12.4, warningLevel: 'attention', updateTime: dayjs().format('YYYY-MM-DD HH:mm') },
  { id: 'r6', name: '广州站', basin: '珠江流域', rainfall: 203.4, oneHourRain: 56.7, warningLevel: 'emergency', updateTime: dayjs().format('YYYY-MM-DD HH:mm') },
  { id: 'r7', name: '南宁站', basin: '珠江流域', rainfall: 142.1, oneHourRain: 35.8, warningLevel: 'warning', updateTime: dayjs().format('YYYY-MM-DD HH:mm') },
  { id: 'r8', name: '蚌埠站', basin: '淮河流域', rainfall: 78.9, oneHourRain: 18.5, warningLevel: 'attention', updateTime: dayjs().format('YYYY-MM-DD HH:mm') },
  { id: 'r9', name: '郑州站', basin: '淮河流域', rainfall: 56.2, oneHourRain: 10.3, warningLevel: 'normal', updateTime: dayjs().format('YYYY-MM-DD HH:mm') },
  { id: 'r10', name: '天津站', basin: '海河流域', rainfall: 34.6, oneHourRain: 6.8, warningLevel: 'normal', updateTime: dayjs().format('YYYY-MM-DD HH:mm') },
];

export const mockWaterLevelStations: WaterLevelStation[] = [
  { id: 'w1', name: '汉口水文站', basin: '长江流域', currentLevel: 27.85, warningLevel: 27.5, isOverWarning: true, trend: 'rising', updateTime: dayjs().format('YYYY-MM-DD HH:mm') },
  { id: 'w2', name: '大通水文站', basin: '长江流域', currentLevel: 14.32, warningLevel: 15.0, isOverWarning: false, trend: 'stable', updateTime: dayjs().format('YYYY-MM-DD HH:mm') },
  { id: 'w3', name: '宜昌水文站', basin: '长江流域', currentLevel: 48.65, warningLevel: 48.0, isOverWarning: true, trend: 'rising', updateTime: dayjs().format('YYYY-MM-DD HH:mm') },
  { id: 'w4', name: '花园口水文站', basin: '黄河流域', currentLevel: 92.45, warningLevel: 93.0, isOverWarning: false, trend: 'falling', updateTime: dayjs().format('YYYY-MM-DD HH:mm') },
  { id: 'w5', name: '泺口水文站', basin: '黄河流域', currentLevel: 28.76, warningLevel: 29.0, isOverWarning: false, trend: 'stable', updateTime: dayjs().format('YYYY-MM-DD HH:mm') },
  { id: 'w6', name: '高要水文站', basin: '珠江流域', currentLevel: 10.52, warningLevel: 10.0, isOverWarning: true, trend: 'rising', updateTime: dayjs().format('YYYY-MM-DD HH:mm') },
  { id: 'w7', name: '梧州水文站', basin: '珠江流域', currentLevel: 18.93, warningLevel: 19.0, isOverWarning: false, trend: 'rising', updateTime: dayjs().format('YYYY-MM-DD HH:mm') },
  { id: 'w8', name: '蚌埠闸水文站', basin: '淮河流域', currentLevel: 19.87, warningLevel: 20.0, isOverWarning: false, trend: 'falling', updateTime: dayjs().format('YYYY-MM-DD HH:mm') },
];

export const mockReservoirs: Reservoir[] = [
  { id: 'rv1', name: '三峡水库', basin: '长江流域', isDangerous: false, currentLevel: 170.5, maxLevel: 175.0, storage: 39300, outflow: 25000, updateTime: dayjs().format('YYYY-MM-DD HH:mm') },
  { id: 'rv2', name: '丹江口水库', basin: '长江流域', isDangerous: true, currentLevel: 158.2, maxLevel: 170.0, storage: 18500, outflow: 12000, updateTime: dayjs().format('YYYY-MM-DD HH:mm') },
  { id: 'rv3', name: '小浪底水库', basin: '黄河流域', isDangerous: false, currentLevel: 255.8, maxLevel: 275.0, storage: 8900, outflow: 3500, updateTime: dayjs().format('YYYY-MM-DD HH:mm') },
  { id: 'rv4', name: '龙羊峡水库', basin: '黄河流域', isDangerous: true, currentLevel: 2580.2, maxLevel: 2600.0, storage: 24500, outflow: 1800, updateTime: dayjs().format('YYYY-MM-DD HH:mm') },
  { id: 'rv5', name: '新丰江水库', basin: '珠江流域', isDangerous: false, currentLevel: 112.3, maxLevel: 116.0, storage: 12500, outflow: 800, updateTime: dayjs().format('YYYY-MM-DD HH:mm') },
  { id: 'rv6', name: '飞来峡水库', basin: '珠江流域', isDangerous: true, currentLevel: 22.8, maxLevel: 24.0, storage: 1560, outflow: 1200, updateTime: dayjs().format('YYYY-MM-DD HH:mm') },
];

export const mockPumpStations: PumpStation[] = [
  { id: 'p1', name: '武汉长江泵站', basin: '长江流域', runningCount: 8, totalCapacity: 200, drainageVolume: 1250, updateTime: dayjs().format('YYYY-MM-DD HH:mm') },
  { id: 'p2', name: '南京浦口泵站', basin: '长江流域', runningCount: 6, totalCapacity: 150, drainageVolume: 890, updateTime: dayjs().format('YYYY-MM-DD HH:mm') },
  { id: 'p3', name: '郑州北郊泵站', basin: '黄河流域', runningCount: 4, totalCapacity: 100, drainageVolume: 560, updateTime: dayjs().format('YYYY-MM-DD HH:mm') },
  { id: 'p4', name: '广州黄埔泵站', basin: '珠江流域', runningCount: 10, totalCapacity: 250, drainageVolume: 1680, updateTime: dayjs().format('YYYY-MM-DD HH:mm') },
  { id: 'p5', name: '蚌埠东泵站', basin: '淮河流域', runningCount: 5, totalCapacity: 120, drainageVolume: 720, updateTime: dayjs().format('YYYY-MM-DD HH:mm') },
];

export const mockWarnings: WarningItem[] = [
  { id: 'warn1', type: 'rainfall', level: 'red', title: '重庆特大暴雨预警', description: '重庆地区累计降雨量已达156.8mm，预计未来6小时仍有强降雨，请做好防洪准备。', location: '重庆市', createTime: dayjs().subtract(2, 'hour').format('YYYY-MM-DD HH:mm'), isHandled: false },
  { id: 'warn2', type: 'rainfall', level: 'orange', title: '广州暴雨橙色预警', description: '广州地区累计降雨量已达203.4mm，城市部分区域出现内涝。', location: '广州市', createTime: dayjs().subtract(3, 'hour').format('YYYY-MM-DD HH:mm'), isHandled: false },
  { id: 'warn3', type: 'waterLevel', level: 'yellow', title: '汉口站超警戒水位', description: '长江汉口水文站水位27.85m，超警戒水位0.35m，呈上涨趋势。', location: '武汉市', createTime: dayjs().subtract(4, 'hour').format('YYYY-MM-DD HH:mm'), isHandled: false },
  { id: 'warn4', type: 'reservoir', level: 'orange', title: '丹江口水库险情预警', description: '丹江口水库（病险水库）水位快速上涨，已达158.2m，需加强监测。', location: '湖北省丹江口市', createTime: dayjs().subtract(5, 'hour').format('YYYY-MM-DD HH:mm'), isHandled: false },
  { id: 'warn5', type: 'other', level: 'blue', title: '海河流域山洪灾害风险提示', description: '山区可能发生山洪灾害，请提醒下游群众注意安全。', location: '海河流域山区', createTime: dayjs().subtract(6, 'hour').format('YYYY-MM-DD HH:mm'), isHandled: true, handleTime: dayjs().subtract(2, 'hour').format('YYYY-MM-DD HH:mm') },
];

export const mockDisposals: DisposalItem[] = [
  { id: 'd1', title: '重庆城区排涝抢险', description: '组织抢险队伍对重庆城区内涝区域进行排涝，转移受困群众。', relatedWarningId: 'warn1', personInCharge: '张建国', status: 'processing', progress: 65, createTime: dayjs().subtract(2, 'hour').format('YYYY-MM-DD HH:mm'), deadline: dayjs().add(4, 'hour').format('YYYY-MM-DD HH:mm'), remarks: ['已调派3支抢险队伍', '已转移群众120人'] },
  { id: 'd2', title: '丹江口水库巡查加固', description: '对丹江口水库大坝进行24小时不间断巡查，准备抢险物资。', relatedWarningId: 'warn4', personInCharge: '李明华', status: 'processing', progress: 40, createTime: dayjs().subtract(3, 'hour').format('YYYY-MM-DD HH:mm'), deadline: dayjs().add(6, 'hour').format('YYYY-MM-DD HH:mm'), remarks: ['巡查队伍已到位', '沙袋等物资正在运输'] },
  { id: 'd3', title: '广州黄埔泵站全力排涝', description: '黄埔泵站10台机组全开，全力排涝降低城市内涝水位。', relatedWarningId: 'warn2', personInCharge: '王志强', status: 'completed', progress: 100, createTime: dayjs().subtract(5, 'hour').format('YYYY-MM-DD HH:mm'), deadline: dayjs().add(1, 'hour').format('YYYY-MM-DD HH:mm'), remarks: ['排涝效果明显', '内涝区域已基本排除'] },
  { id: 'd4', title: '长江堤防巡查', description: '组织人员对长江武汉段堤防进行拉网式巡查，排查隐患。', relatedWarningId: 'warn3', personInCharge: '陈海涛', status: 'pending', progress: 0, createTime: dayjs().subtract(1, 'hour').format('YYYY-MM-DD HH:mm'), deadline: dayjs().add(8, 'hour').format('YYYY-MM-DD HH:mm'), remarks: [] },
];

export const mockReport: DailyReport = {
  id: 'report1',
  date: dayjs().format('YYYY-MM-DD'),
  title: `${dayjs().format('YYYY年MM月DD日')}防汛值班日报`,
  content: `<h2>一、雨情水情概况</h2>
<p>今日我市普降大到暴雨，局部地区出现特大暴雨。全市平均降雨量85.6mm，最大降雨量出现在重庆站，达156.8mm。</p>
<h3>（一）降雨情况</h3>
<ul>
<li>长江流域：平均降雨量123.9mm，最大站重庆站156.8mm</li>
<li>珠江流域：平均降雨量172.8mm，最大站广州站203.4mm</li>
<li>黄河流域：平均降雨量56.4mm，最大站济南站67.5mm</li>
<li>淮河流域：平均降雨量67.6mm，最大站蚌埠站78.9mm</li>
<li>海河流域：平均降雨量34.6mm，最大站天津站34.6mm</li>
</ul>
<h3>（二）水情情况</h3>
<p>长江干流汉口站水位27.85m，超警戒水位0.35m，呈上涨趋势；宜昌站水位48.65m，超警戒水位0.65m。珠江流域高要站水位10.52m，超警戒水位0.52m。</p>
<h2>二、工程运行情况</h2>
<p>全市6座大中型水库运行基本正常，其中3座病险水库正在加强监测。三峡水库水位170.5m，运行平稳。各泵站累计排涝5100万立方米。</p>
<h2>三、预警发布情况</h2>
<p>今日共发布预警5条，其中红色预警1条、橙色预警2条、黄色预警1条、蓝色预警1条。主要涉及暴雨和超警水位。</p>
<h2>四、处置情况</h2>
<p>今日共启动处置事项4项，已完成1项，正在处置3项。累计出动抢险人员500余人次，转移群众300余人。</p>`,
  leaderComments: '请各单位继续加强监测预警，做好抢险准备，确保人民群众生命财产安全。—— 王局长',
  versions: [
    { version: 1, content: '初始版本', createTime: dayjs().subtract(3, 'hour').format('YYYY-MM-DD HH:mm'), creator: '值班员张三', changeLog: '初始创建' },
  ],
  status: 'draft',
  createTime: dayjs().subtract(3, 'hour').format('YYYY-MM-DD HH:mm'),
  updateTime: dayjs().subtract(1, 'hour').format('YYYY-MM-DD HH:mm'),
  creator: '值班员张三',
};

export const mockSystemConfig: SystemConfig = {
  basins: BASINS,
  rainfallWarning: {
    attention: 50,
    warning: 100,
    emergency: 150,
  },
  sensitiveWords: ['敏感词1', '敏感词2', '敏感词3', '涉密', '内部资料'],
  reminderTime: '17:00',
};

export const mockUsers = [
  { id: 'u1', name: '张三', role: '值班员', phone: '13800138001', email: 'zhangsan@water.gov.cn' },
  { id: 'u2', name: '李四', role: '值班员', phone: '13800138002', email: 'lisi@water.gov.cn' },
  { id: 'u3', name: '王建国', role: '值班长', phone: '13800138003', email: 'wangjianguo@water.gov.cn' },
  { id: 'u4', name: '王明', role: '领导', phone: '13800138004', email: 'wangming@water.gov.cn' },
  { id: 'u5', name: '赵伟', role: '管理员', phone: '13800138005', email: 'zhaowei@water.gov.cn' },
];

export const mockArchivedReports = [
  { id: 'a1', date: dayjs().subtract(1, 'day').format('YYYY-MM-DD'), title: `${dayjs().subtract(1, 'day').format('YYYY年MM月DD日')}防汛值班日报`, status: 'archived', creator: '值班员张三' },
  { id: 'a2', date: dayjs().subtract(2, 'day').format('YYYY-MM-DD'), title: `${dayjs().subtract(2, 'day').format('YYYY年MM月DD日')}防汛值班日报`, status: 'archived', creator: '值班员李四' },
  { id: 'a3', date: dayjs().subtract(3, 'day').format('YYYY-MM-DD'), title: `${dayjs().subtract(3, 'day').format('YYYY年MM月DD日')}防汛值班日报`, status: 'archived', creator: '值班员张三' },
];
