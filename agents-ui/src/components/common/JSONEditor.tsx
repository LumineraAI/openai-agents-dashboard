import React, { useState, useEffect } from 'react';
import { Box, Paper } from '@mui/material';
import MonacoEditor from '@monaco-editor/react';

interface JSONEditorProps {
  value: Record<string, any>;
  onChange: (value: Record<string, any>) => void;
  height?: string;
  readOnly?: boolean;
}

const JSONEditor: React.FC<JSONEditorProps> = ({ 
  value, 
  onChange, 
  height = '300px',
  readOnly = false
}) => {
  const [editorValue, setEditorValue] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const formatted = JSON.stringify(value, null, 2);
      setEditorValue(formatted);
      setError(null);
    } catch (err) {
      console.error('Error formatting JSON:', err);
      setError('Invalid JSON object');
    }
  }, [value]);

  const handleEditorChange = (value: string | undefined) => {
    if (!value) return;
    
    setEditorValue(value);
    
    try {
      const parsed = JSON.parse(value);
      onChange(parsed);
      setError(null);
    } catch (err) {
      setError('Invalid JSON');
      // Don't update the parent value if the JSON is invalid
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper 
        variant="outlined" 
        sx={{ 
          overflow: 'hidden',
          border: error ? '1px solid red' : undefined
        }}
      >
        <MonacoEditor
          height={height}
          language="json"
          value={editorValue}
          onChange={handleEditorChange}
          options={{
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            folding: true,
            lineNumbers: 'on',
            readOnly,
            automaticLayout: true
          }}
        />
      </Paper>
      {error && (
        <Box sx={{ color: 'error.main', mt: 1, fontSize: '0.75rem' }}>
          {error}
        </Box>
      )}
    </Box>
  );
};

export default JSONEditor;