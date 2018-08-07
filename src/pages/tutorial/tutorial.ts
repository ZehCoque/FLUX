import { Component } from '@angular/core';
import { NavController, NavParams , ViewController } from 'ionic-angular';
import { HomePage } from '../../pages/home/home';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html',
})
export class TutorialPage {

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private view: ViewController,
    public storage: Storage) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TutorialPage');

  }

  closeTutorial(){
    this.storage.set('hasSeenTutorial', 'true');
    this.navCtrl.push(HomePage);
  }
}
