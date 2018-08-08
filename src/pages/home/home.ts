import { Component, ViewChild } from '@angular/core';
import { NavController, Events, Nav, Platform, 
  ModalController, AlertController, ToastController } from 'ionic-angular';
  import { File } from '@ionic-native/file';

  //Pages
  import { TutorialPage } from '../tutorial/tutorial';

  //Providers
  import { UserDataProvider, inputDataList } from '../../providers/user-data/user-data';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  @ViewChild(Nav) nav: Nav;

  configData: inputDataList;
  inputData: any;
  filename: string;
  configFolder: any;
  inputDataFolder: any;

  constructor(
    public navCtrl: NavController,
    public modal: ModalController,
    public userData: UserDataProvider,
    public file: File,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController) {

  }

  openTutorial() {
    this.nav.setRoot(TutorialPage);
  }

  openBTConfig() {
    const BTModal = this.modal.create('BluetoothPage');
    BTModal.present();
  }

  load() {
    const LoadModal = this.modal.create('LoadPage');
    LoadModal.onDidDismiss((configData_from_storage) => {
      this.configData = configData_from_storage;
      this.nav.setRoot(HomePage);
      });
    LoadModal.present();
  }

  saveAndNext() {
    this.filename = this.configData.title;

    //Check if folder exists
    this.file.checkDir(this.file.dataDirectory, 'FLUX')
    .then(() => {
      this.configFolder = this.file.checkDir((this.file.externalRootDirectory + 'FLUX'),'config');
      this.inputDataFolder = this.file.checkDir((this.file.externalRootDirectory + 'FLUX'),'data');
    })
    .catch(() => {
      this.file.createDir(this.file.externalRootDirectory,'FLUX',true);
      this.configFolder = this.file.createDir((this.file.externalRootDirectory + 'FLUX'),'config',true);
      this.inputDataFolder = this.file.createDir((this.file.externalRootDirectory + 'FLUX'),'data',true);
    });

    //Save inputs
    this.userData.getInputs().then((inputs) => {
      this.inputDataFolder.then(data =>{
        let dirPath = data.toURL();
        this.file.writeFile(dirPath, (this.configData.title + '.csv'), String(inputs), {replace:true});
        let savetoast = this.toastCtrl.create({
          message: this.filename + " salvo com sucesso!",
          duration: 3000,
          position: 'bottom'
        })
        savetoast.present();
      }
    ).catch(_error =>
    {
        let errorAlert = this.alertCtrl.create({
          title: "Erro: Diretório não encontrado."
        })
        errorAlert.present();
    })
    })

    //Save Configurations
    this.userData.getData().then((config) =>{
      this.configFolder.then(data =>{
        let dirPath = data.toURL();
        this.file.writeFile(dirPath, (this.configData.title + '.config' + '.csv'), String(this.configData), {replace:true});
      }
    ).catch(_error =>
    {
        let errorAlert = this.alertCtrl.create({
          title: "Erro: Diretório não encontrado."
        })
        errorAlert.present();
    })
    })

    //Next button

  }

}
