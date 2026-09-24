import { useMemo, useState } from 'react';

type Message = {
  role: 'user' | 'assistant';
  text: string;
};

type FileNode = {
  id: string;
  name: string;
  type: 'folder' | 'file';
  children?: FileNode[];
  content?: string;
  language?: string;
};

const files: FileNode[] = [
  {
    id: 'src',
    name: 'src',
    type: 'folder',
    children: [
      {
        id: 'src/App.tsx',
        name: 'App.tsx',
        type: 'file',
        language: 'tsx',
        content: `export default function App() {
  return (
    <main className="app-shell">
      <h1>Herqul Code</h1>
    </main>
  );
}`
      },
      {
        id: 'src/pages/Login.tsx',
        name: 'Login.tsx',
        type: 'file',
        language: 'tsx',
        content: `export function Login() {
  return <section>صفحة تسجيل الدخول</section>;
}`
      },
      {
        id: 'src/pages/Dashboard.tsx',
        name: 'Dashboard.tsx',
        type: 'file',
        language: 'tsx',
        content: `export function Dashboard() {
  return <section>لوحة التحكم</section>;
}`
      },
      {
        id: 'src/pages/Orders.tsx',
        name: 'Orders.tsx',
        type: 'file',
        language: 'tsx',
        content: `export function Orders() {
  return <section>الطلبات</section>;
}`
      }
    ]
  },
  {
    id: 'package.json',
    name: 'package.json',
    type: 'file',
    language: 'json',
    content: `{
  "name": "herqul-code",
  "private": true
}`
  },
  {
    id: 'README.md',
    name: 'README.md',
    type: 'file',
    language: 'md',
    content: `# Herqul Code\n\nAI Programming Agent.`
  }
];

const initialMessages: Message[] = [
  { role: 'assistant', text: 'مرحبًا! أنا Herqul Code. ماذا تريد أن تبنيه اليوم؟' },
  { role: 'user', text: 'أنشئ لي نظام مشتريات عربي باستخدام React وTypeScript.' },
  { role: 'assistant', text: 'سأقوم بتحليل المشروع، إنشاء الصفحات، وربط التنقل ثم اختبار التطبيق.' }
];

const initialLogs = [
  '✅ تم فحص هيكل المشروع',
  '📦 تم اكتشاف React + TypeScript',
  '🧠 تم إنشاء خطة التنفيذ',
  '📝 تم إعداد شاشة تسجيل الدخول ولوحة التحكم'
];

const initialDiff = [
  'src/pages/Login.tsx — تم إنشاء صفحة تسجيل الدخول',
  'src/pages/Dashboard.tsx — تم إنشاء لوحة التحكم',
  'src/pages/Orders.tsx — تم إنشاء صفحة الطلبات',
  'src/App.tsx — تم تحديث التنقل الرئيسي'
];

function getFileById(nodes: FileNode[], target: string): FileNode | null {
  for (const node of nodes) {
    if (node.id === target) return node;
    if (node.children) {
      const match = getFileById(node.children, target);
      if (match) return match;
    }
  }
  return null;
}

export default function App() {
  const [selectedFile, setSelectedFile] = useState('src/App.tsx');
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('أنشئ صفحة الموردين مع البحث والتصفية');
  const [logs, setLogs] = useState<string[]>(initialLogs);
  const [diff, setDiff] = useState<string[]>(initialDiff);

  const activeFile = useMemo(() => getFileById(files, selectedFile), [selectedFile]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    const nextMessages = [...messages, { role: 'user', text: userMessage }];

    const reply = `تمت معالجتك: ${userMessage}. سأقوم بقراءة المشروع، تعديل الملفات المطلوبة، وتشغيل فحص النوع/الاختبارات والتأكد من أن التغييرات تعمل بشكل صحيح.`;

    setMessages([...nextMessages, { role: 'assistant', text: reply }]);
    setLogs((prev) => [
      ...prev,
      `💬 تم استقبال الطلب: ${userMessage}`,
      '🔍 تنفيذ التحليل وإعداد خطة العمل',
      '🛠️ تحديث الملفات المطلوبة'
    ]);
    setDiff((prev) => [
      ...prev,
      `src/pages/Orders.tsx — تم تحديث الصفحة وفق طلب المستخدم: ${userMessage}`
    ]);
    setInput('');
    setSelectedFile('src/pages/Orders.tsx');
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-wrap">
          <div className="brand-icon">H</div>
          <div>
            <p className="eyebrow">AI Programming Agent</p>
            <h1>Herqul Code</h1>
          </div>
        </div>

        <div className="top-actions">
          <button className="secondary">إنشاء مشروع</button>
          <button className="primary">تنفيذ</button>
        </div>
      </header>

      <main className="workspace-grid">
        <aside className="sidebar panel">
          <div className="panel-header">
            <span>المشروع</span>
            <span className="badge">React + TS</span>
          </div>

          <div className="project-tree">
            {files.map((node) => (
              <div key={node.id} className="tree-node">
                <button
                  className={`tree-item ${selectedFile === node.id ? 'selected' : ''}`}
                  onClick={() => node.type === 'file' && setSelectedFile(node.id)}
                >
                  <span>{node.type === 'folder' ? '📁' : '📄'}</span>
                  <span>{node.name}</span>
                </button>

                {node.children && (
                  <div className="tree-children">
                    {node.children.map((child) => (
                      <button
                        key={child.id}
                        className={`tree-item child ${selectedFile === child.id ? 'selected' : ''}`}
                        onClick={() => setSelectedFile(child.id)}
                      >
                        <span>{child.type === 'folder' ? '📁' : '📄'}</span>
                        <span>{child.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </aside>

        <section className="center-panel">
          <div className="panel chat-panel">
            <div className="panel-header">
              <span>دردشة الوكيل</span>
              <span className="status online">متصل</span>
            </div>

            <div className="messages">
              {messages.map((message, index) => (
                <div key={`${message.role}-${index}`} className={`message ${message.role}`}>
                  <div className="bubble">
                    {message.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="composer">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={3}
                placeholder="اكتب ما تريد بناءه..."
              />
              <button className="primary large" onClick={handleSend}>تنفيذ</button>
            </div>
          </div>

          <div className="panel code-panel">
            <div className="panel-header">
              <span>{activeFile?.name ?? 'ملف'}</span>
              <span className="badge">{activeFile?.language ?? 'text'}</span>
            </div>

            <pre className="code-box">
              <code>{activeFile?.content ?? 'لا يوجد محتوى'}</code>
            </pre>
          </div>
        </section>

        <aside className="right-panel">
          <div className="panel mini-panel">
            <div className="panel-header">
              <span>Terminal</span>
              <span className="badge">live</span>
            </div>
            <ul className="terminal-list">
              {logs.map((line, index) => (
                <li key={`${line}-${index}`}>{line}</li>
              ))}
            </ul>
          </div>

          <div className="panel mini-panel">
            <div className="panel-header">
              <span>Git Diff</span>
              <span className="badge">3 files</span>
            </div>
            <ul className="diff-list">
              {diff.map((item, index) => (
                <li key={`${item}-${index}`}>{item}</li>
              ))}
            </ul>
          </div>
        </aside>
      </main>
    </div>
  );
}
