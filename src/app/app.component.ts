import { StatusBar } from '@ionic-native/status-bar';
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, ModalController, AlertController, ToastController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import { BLE } from '@ionic-native/ble'
import { Diagnostic } from '@ionic-native/diagnostic';
//import { File } from '@ionic-native/file';

// Pages
import { TutorialPage } from '../pages/tutorial/tutorial';
import { HomePage } from '../pages/home/home';
//Providers
//import { UserDataProvider, DataList } from '../providers/user-data/user-data';

@Component({
  templateUrl: 'app.html',
  providers: [BLE]
})

export class MyApp {
  rootPage:any;

  @ViewChild(Nav) nav: Nav;

  constructor(    
    //public events: Events,
    //public userData: UserDataProvider,
    //public menu: MenuController,
    public platform: Platform,
    public storage: Storage,
    public splashScreen: SplashScreen,
    public statusBar: StatusBar,
    public modal: ModalController,
    public alertCtrl: AlertController,
    //public file: File,
    public toastCrtl: ToastController,
    private ble: BLE,
    private diagnostic: Diagnostic) {


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
