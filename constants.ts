
import type { Topic } from './types';
import { BrainIcon, ComputerIcon, DatabaseIcon, NetworkIcon, ShieldIcon, CodeIcon, BriefcaseIcon, LightbulbIcon } from './components/icons/Icons';

export const FE_TOPICS: Topic[] = [
  { id: 'theory', name: '基礎理論 (Lý thuyết cơ bản)', icon: BrainIcon },
  { id: 'system', name: 'コンピュータシステム (Hệ thống máy tính)', icon: ComputerIcon },
  { id: 'db', name: 'データベース (Cơ sở dữ liệu)', icon: DatabaseIcon },
  { id: 'network', name: 'ネットワーク (Mạng)', icon: NetworkIcon },
  { id: 'security', name: 'セキュリティ (Bảo mật)', icon: ShieldIcon },
  { id: 'dev', name: '開発技術 (Kỹ thuật phát triển)', icon: CodeIcon },
  { id: 'mgmt', name: 'プロジェクトマネジメント (Quản lý dự án)', icon: BriefcaseIcon },
  { id: 'strategy', name: 'ストラテジ (Chiến lược)', icon: LightbulbIcon },
];

export const ISTQB_TOPICS: Topic[] = [
  { id: 'fundamentals', name: 'Testing Fundamentals', icon: BrainIcon },
  { id: 'lifecycle', name: 'Testing Throughout PLC', icon: ComputerIcon },
  { id: 'static', name: 'Static Testing', icon: CodeIcon },
  { id: 'techniques', name: 'Test Techniques', icon: LightbulbIcon },
  { id: 'management', name: 'Test Management', icon: BriefcaseIcon },
  { id: 'tools', name: 'Tool Support', icon: DatabaseIcon },
];

export const TOPIC_ANALYSIS_DATA = [
    { name: '基礎理論', frequency: 16 },
    { name: 'コンピュータシステム', frequency: 20 },
    { name: '開発技術', frequency: 15 },
    { name: 'プロジェクトマネジメント', frequency: 10 },
    { name: 'ストラテジ', frequency: 21 },
    { name: 'セキュリティ', frequency: 18 },
];
