'use client'

import dynamic from 'next/dynamic'
import { useTheme } from 'next-themes'

const Editor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

interface MonacoEditorProps {
  value: string
  onChange: (value: string) => void
  language?: string
  height?: string
}

export function MonacoEditor({
  value,
  onChange,
  language = 'csharp',
  height = '100%',
}: MonacoEditorProps) {
  const { resolvedTheme } = useTheme()
  const monacoTheme = resolvedTheme === 'dark' ? 'vs-dark' : 'vs'

  return (
    <Editor
      height={height}
      language={language}
      theme={monacoTheme}
      value={value}
      onChange={(val) => onChange(val ?? '')}
      options={{
        fontSize: 14,
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace",
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        lineNumbers: 'on',
        renderLineHighlight: 'line',
        tabSize: 4,
        wordWrap: 'on',
        formatOnPaste: true,
        automaticLayout: true,
      }}
    />
  )
}
