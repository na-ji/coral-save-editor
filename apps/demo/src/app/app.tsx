// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.css';
import { read_outer_save } from '@coral/save-parser';
import { ChangeEvent, useCallback, useState } from 'react';
import { SvelteJSONEditor } from './JSONEditor';

export function App() {
  const [saveData, setSaveData] = useState<{ json: object } | undefined>();

  const handleFileSelection = useCallback((changeEvent: ChangeEvent<HTMLInputElement>) => {
    const saveFile = changeEvent.target.files[0];
    const reader = new FileReader();
    reader.addEventListener('loadend', (event) => {
      try {
        const binarySave = read_outer_save(event.target.result);
        const result = new TextDecoder().decode(binarySave);
        setSaveData({ json: JSON.parse(result) });
      } catch (e) {
        console.error(e);
      }
    });

    reader.readAsArrayBuffer(saveFile);
  }, []);

  return (
    <div>
      <input id="save" type="file" onChange={handleFileSelection} />
      {saveData && <SvelteJSONEditor content={saveData} readOnly={true} />}
    </div>
  );
}
