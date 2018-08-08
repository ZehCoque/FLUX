import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage';

const userInputData = 'userInputData';
const userInputs = 'Inputs';
const BLE_device = 'BLE_device';

@Injectable()
export class UserDataProvider {
  HAS_SEEN_TUTORIAL = 'hasSeenTutorial';

  constructor(public storage: Storage) {
  }

  checkHasSeenTutorial(): Promise<string> {
    return this.storage.get(this.HAS_SEEN_TUTORIAL).then((value) => {
      return value;
    });
  };

  getData() {
    return this.storage.get(userInputData);
  }

  setData(value) {
    this.storage.set(userInputData,value).then((value) => {
      return value;
    });
  }

  setInputs(value){
    this.storage.set(userInputs,value).then((value) => {
      return value;
    });
  }

  getInputs() {
    return this.storage.get(userInputs);
  }

  setBLE_saved_device(device){
    this.storage.set(BLE_device,device).then((value) =>{
      return value;
    })
  }

  getBLE_saved_device() {
    return this.storage.get(BLE_device);
  }

}

export class inputDataList{
  title: string;
  ref: number;
  max_err: number;
  units: string;
}

export class HomeInputData {
homeInputs: number[];
}