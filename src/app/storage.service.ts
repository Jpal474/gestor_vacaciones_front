import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private SECRETKEY = 'LMkjo~Xw]FEn9]BIvls05A4nlV%mUzV{Q6s35RTd~h3(m-6';

  constructor() {}

  public setLocalStorageItem(objectName: string, object2save: object | number | string): void {
    const STRINGIFYOBJECT = JSON.stringify(object2save); 

    const CIPHEROBJECT = CryptoJS.AES.encrypt(
      STRINGIFYOBJECT,
      this.SECRETKEY
    ).toString();

    

    localStorage.setItem(objectName, CIPHEROBJECT);
  }

  public getLocalStorageItem(objectName: string): object | null {
    const RETRIEVEDOBJECT = localStorage.getItem(objectName) as string;
    if (RETRIEVEDOBJECT) {
      const BYTES = CryptoJS.AES.decrypt(RETRIEVEDOBJECT, this.SECRETKEY);

      const ORIGINALSTRING = BYTES.toString(CryptoJS.enc.Utf8);

      const jsonObject = JSON.parse(ORIGINALSTRING);

      return jsonObject;
    } else {
      return null;
    }
  }

  public deleteLocalStorageItem(objectName: string): void {
    localStorage.removeItem(objectName);
  }

  public clearLocalStorage(): void {
    localStorage.clear();
  }
}
