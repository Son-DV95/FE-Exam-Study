
import type { Question } from './types';

export const pastExams: Record<string, Question[]> = {
  'network': [
    {
      questionText: {
        ja: 'OSI基本参照モデルのトランスポート層に位置付けられるプロトコルはどれか。',
        en: 'Which protocol is located at the Transport Layer of the OSI Basic Reference Model?',
        vi: 'Giao thức nào nằm ở Tầng Giao vận (Transport Layer) của mô hình tham chiếu OSI?'
      },
      options: {
        ja: ['HTTP', 'IP', 'TCP', 'PPP'],
        en: ['HTTP', 'IP', 'TCP', 'PPP'],
        vi: ['HTTP', 'IP', 'TCP', 'PPP']
      },
      correctAnswerIndex: 2,
      explanation: {
        ja: 'TCP(Transmission Control Protocol)は、OSI基本参照モデルのトランスポート層に位置づけられるプロトコルです。HTTPはアプリケーション層、IPはネットワーク層、PPPはデータリンク層のプロトコルです。',
        en: 'TCP (Transmission Control Protocol) is a protocol located at the Transport Layer of the OSI Basic Reference Model. HTTP is in the Application Layer, IP is in the Network Layer, and PPP is in the Data Link Layer.',
        vi: 'TCP (Transmission Control Protocol) là giao thức nằm ở tầng giao vận của mô hình OSI. HTTP thuộc tầng ứng dụng, IP thuộc tầng mạng, và PPP thuộc tầng liên kết dữ liệu.'
      }
    },
    {
      questionText: {
        ja: 'WebサーバとWebブラウザの間で、データを安全にやり取りするためのプロトコルはどれか。',
        en: 'Which protocol is used to securely exchange data between a Web server and a Web browser?',
        vi: 'Giao thức nào được sử dụng để trao đổi dữ liệu một cách an toàn giữa máy chủ Web và trình duyệt Web?'
      },
      options: {
        ja: ['SMTP', 'HTTPS', 'FTP', 'NTP'],
        en: ['SMTP', 'HTTPS', 'FTP', 'NTP'],
        vi: ['SMTP', 'HTTPS', 'FTP', 'NTP']
      },
      correctAnswerIndex: 1,
      explanation: {
        ja: 'HTTPS(Hypertext Transfer Protocol Secure)は、SSL/TLSプロトコルによって通信を暗号化し、安全なデータ送受信を実現します。',
        en: 'HTTPS (Hypertext Transfer Protocol Secure) uses the SSL/TLS protocol to encrypt communications, enabling secure data transmission and reception.',
        vi: 'HTTPS (Hypertext Transfer Protocol Secure) sử dụng giao thức SSL/TLS để mã hóa giao tiếp, cho phép gửi và nhận dữ liệu an toàn.'
      }
    }
  ],
  'security': [
      {
          questionText: {
            ja: '情報セキュリティのCIAとして知られる3つの要素はどれか。',
            en: 'What are the three elements known as the CIA of information security?',
            vi: 'Ba yếu tố được gọi là CIA trong an toàn thông tin là gì?'
          },
          options: {
            ja: ['機密性、完全性、可用性', '認証、認可、監査', '暗号化、ファイアウォール、ウイルス対策', 'リスク評価、対策、監視'],
            en: ['Confidentiality, Integrity, Availability', 'Authentication, Authorization, Accounting', 'Encryption, Firewall, Antivirus', 'Risk Assessment, Countermeasures, Monitoring'],
            vi: ['Tính bí mật, Tính toàn vẹn, Tính sẵn sàng', 'Xác thực, Phân quyền, Kiểm toán', 'Mã hóa, Tường lửa, Chống virus', 'Đánh giá rủi ro, Biện pháp đối phó, Giám sát']
          },
          correctAnswerIndex: 0,
          explanation: {
            ja: '情報セキュリティの最も基本的な3つの要素は、機密性(Confidentiality)、完全性(Integrity)、可用性(Availability)であり、それぞれの頭文字をとってCIAと呼ばれます。',
            en: 'The three most basic elements of information security are Confidentiality, Integrity, and Availability, referred to as CIA by their initials.',
            vi: 'Ba yếu tố cơ bản nhất của an toàn thông tin là Tính bí mật (Confidentiality), Tính toàn vẹn (Integrity), và Tính sẵn sàng (Availability), được gọi tắt là CIA.'
          }
      }
  ],
  'db': [
      {
          questionText: {
            ja: 'データベースにおいて、トランザクションが持つべき4つの特性(ACID特性)に含まれないものはどれか。',
            en: 'Which of the following is NOT included in the four properties (ACID properties) that a transaction in a database should possess?',
            vi: 'Yếu tố nào sau đây KHÔNG nằm trong 4 đặc tính (đặc tính ACID) mà một giao dịch trong cơ sở dữ liệu cần phải có?'
          },
          options: {
            ja: ['原子性(Atomicity)', '一貫性(Consistency)', '独立性(Isolation)', '並行性(Concurrency)'],
            en: ['Atomicity', 'Consistency', 'Isolation', 'Concurrency'],
            vi: ['Tính nguyên tử (Atomicity)', 'Tính nhất quán (Consistency)', 'Tính độc lập (Isolation)', 'Tính đồng thời (Concurrency)']
          },
          correctAnswerIndex: 3,
          explanation: {
            ja: 'ACID特性は、原子性(Atomicity)、一貫性(Consistency)、独立性(Isolation)、永続性(Durability)の4つです。並行性(Concurrency)はACID特性には含まれません。',
            en: 'The ACID properties are Atomicity, Consistency, Isolation, and Durability. Concurrency is not included in the ACID properties.',
            vi: 'Các đặc tính ACID bao gồm Tính nguyên tử (Atomicity), Tính nhất quán (Consistency), Tính độc lập (Isolation), và Tính bền vững (Durability). Tính đồng thời (Concurrency) không nằm trong các đặc tính ACID.'
          }
      }
  ]
};
