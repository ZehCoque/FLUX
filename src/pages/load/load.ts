import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, 
  ViewController, AlertController } from 'ionic-angular';
import { File } from '@ionic-native/file';
import * as papa from 'papaparse';
import { Http } from '@angular/http';

//Providers
import { UserDataProvider, inputDataList } from '../../providers/user-data/user-data';

@IonicPage()
@Component({
  selector: 'page-load',
  templateUrl: 'load.html',
})
export class LoadPage {
  filelist: string[] =[];
  text: any;
  nofiles: boolean;
  configData: inputDataList;

  constructor(
    private view: ViewController,
    public navCtrl: NavController, 
    public navParams: NavParams,
    public file: File,
    public http: Http,
    public alertCtrl: AlertController,
    public userData: UserDataProvider) {

  }

  ionViewDidLoad() {
    let result = this.file.listDir((this.file.externalRootDirectory + 'medidordefluxo'),'data');
    result.then(files =>
    {
      this.nofiles = false;
      for (let i=0;i<files.length;i++){
        this.filelist[i] = files[i].name.replace(".csv","");
      }
      
    }).catch(error => {
      console.log(error);
      this.nofiles = true;
    })
  }

  loadFile(index){
    this.http.get((this.file.externalRootDirectory + 'medidordefluxo/data/' + this.filelist[index] + ".csv"))
    .subscribe(
      data => this.extractInputs(data),
      err => this.errorAlert("Arquivo não encontrado",err)
    );
    this.http.get((this.file.externalRootDirectory + 'medidordefluxo/config/' + this.filelist[index] + ".config.csv"))
    .subscribe(
      data => this.extractConfig(data),
      err => this.errorAlert("Arquivo não encontrado",err)
    );
    
  }

  extractInputs(res){
    let csvData = res['_body'] || '';
    let parsedData = papa.parse(csvData).data;
    let inputData = parsedData[0];
    this.userData.setInputs(inputData);
  }

  extractConfig(res){
    let csvData = res['_body'] || '';
    let parsedData = papa.parse(csvData).data;
    this.configData={
      title: parsedData[0][0],
      ref: parsedData[0][3],
      max_err: parsedData[0][2],
      units: parsedData[0][4],
    }
    this.userData.setData(this.configData);
    this.view.dismiss(this.configData);
  }

  errorAlert(message,error){
    let error_alert = this.alertCtrl.create({
      title: message,
      subTitle: error
    })
    error_alert.present();
  }

  cancelLoadModal(){
    this.view.dismiss();
  }

}
