// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.css';
import { decode_save, encode_save } from '@coral/save-parser';
import { ChangeEvent, useCallback, useState } from 'react';
import { SvelteJSONEditor } from './JSONEditor';

const downloadURL = (url: string, fileName: string) => {
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.style.display = 'none';
  a.click();
  a.remove();
};

const downloadBlob = (data: Uint8Array, fileName: string, mimeType: string) => {
  const blob = new Blob([data], {
    type: mimeType,
  });

  const url = window.URL.createObjectURL(blob);

  downloadURL(url, fileName);

  setTimeout(() => window.URL.revokeObjectURL(url), 1000);
};

export function App() {
  const [fileContent, setFileContent] = useState<{ name: string; content: ArrayBuffer } | undefined>();
  const [saveData, setSaveData] = useState<{ json: object; text: undefined } | undefined>();

  const handleFileSelection = useCallback((changeEvent: ChangeEvent<HTMLInputElement>) => {
    const saveFile = changeEvent.target.files[0];
    const reader = new FileReader();
    reader.addEventListener('loadend', (event) => {
      try {
        const binarySave = decode_save(event.target.result);
        setSaveData({ json: binarySave, text: undefined });
        setFileContent({ name: saveFile.name, content: event.target.result });
      } catch (e) {
        console.error(e);
      }
    });

    reader.readAsArrayBuffer(saveFile);
  }, []);

  const exportSave = useCallback(() => {
    if (!fileContent || !saveData) {
      return;
    }

    const fileData = encode_save(fileContent.content, saveData.json);
    downloadBlob(fileData, fileContent.name, 'application/octet-stream');
  }, [fileContent, saveData]);

  return (
    <div>
      <input id="save" type="file" onChange={handleFileSelection} style={{ marginBottom: '1rem' }} />
      {saveData && (
        <>
          <button onClick={exportSave}>Export</button>
          <SvelteJSONEditor content={saveData} onChange={setSaveData} />
        </>
      )}
    </div>
  );
}
