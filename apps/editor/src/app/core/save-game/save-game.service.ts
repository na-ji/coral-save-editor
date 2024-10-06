import { Injectable, signal } from '@angular/core';
import { decode_save } from '@coral/save-parser';

@Injectable({
  providedIn: 'root',
})
export class SaveGameService {
  readonly status = signal<'NOT_STARTED' | 'PROCESSING' | 'SUCCESS' | 'ERROR'>('NOT_STARTED');
  readonly decodedData = signal<undefined | null | Record<string, any>>(null);

  parseSaveGame(saveFile: File) {
    const reader = new FileReader();
    reader.addEventListener('loadend', (event) => {
      try {
        const target = event.target;
        if (target?.result) {
          const binarySave = decode_save(target.result as ArrayBuffer);
          this.decodedData.set(binarySave);
          this.status.set('SUCCESS');
        }
      } catch (e) {
        this.status.set('ERROR');
        console.error(e);
      }
    });
    this.status.set('PROCESSING');
    reader.readAsArrayBuffer(saveFile);
  }
}
