import { Component } from '@angular/core';
import { Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import { BLE } from '@ionic-native/ble'
import { Diagnostic } from '@ionic-native/diagnostic';
import { File } from '@ionic-native/file';

import { HomePage } from '../pages/home/home';
import { TutorialPage } from '../pages/tutorial/tutorial';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;
  
  configFolder: any;
  dataFolder: any;
  
  constructor(
    public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen,
    private diagnostic: Diagnostic,
    public alertCtrl: AlertController,
    private ble: BLE,
    public storage: Storage,
    public file: File,) {
      
      this.file.checkDir(this.file.dataDirectory, 'FLUX').catch(_error => {
        this.file.createDir(this.file.externalRootDirectory,'FLUX',true);
        this.configFolder = this.file.createDir((this.file.externalRootDirectory + 'FLUX'),'config',true);
        this.dataFolder = this.file.createDir((this.file.externalRootDirectory + 'FLUX'),'data',true);
      });

      statusBar.styleDefault();
      splashScreen.hide();

      this.storage.get('hasSeenTutorial')
      .then((hasSeenTutorial) => {
        if (hasSeenTutorial) {
          this.rootPage = HomePage;
        } else {
          this.rootPage = TutorialPage;
        }
        this.platformReady()
      });
  }

  errorAlert(message,error){
    let error_alert = this.alertCtrl.create({
      title: message,
      subTitle: error
    })
    error_alert.present();
  }

  platformReady() {
    this.platform.ready().then(() => {
      this.splashScreen.hide();
        //Location Settings
        this.diagnostic.isLocationAvailable().then(() => {
          this.diagnostic.getLocationMode().then(value => {
            if (value == "location_off") {
              this.diagnostic.switchToLocationSettings();
            }
          }).catch(error => {
            this.errorAlert("Erro Inesperado",error);
          });
        }
      ).catch(error => {
        this.errorAlert("Erro Inesperado",error)
      });
      
        //Bluetooth Settings
      this.diagnostic.getBluetoothState().then(state => {
        if (state == this.diagnostic.bluetoothState.POWERED_OFF)
        {
          if (this.platform.is('android')){
          this.ble.enable();
          }
          if (this.platform.is('ios')){
            this.diagnostic.switchToBluetoothSettings();          
          }
        }
      })
    });
  }

}

