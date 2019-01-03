
import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';

@Injectable()
export class ToolsProvider {

  constructor(private alertCtrl: AlertController) {
  }

  showAlert(titre: string = "", message: string){
    this.alertCtrl.create({
      title: titre || "",
      message: message,
      buttons: ['OK']
    }).present();
  }

  /**
   * Searching specific member in array
   * @param _searchID 
   * @param _myArray 
   * @param _rubID 
   */
  arraySearch(_searchID, _myArray, _rubID){
    if(!_rubID) {_rubID = "id"; } //default search on "id" member
    for (var i=0; i < _myArray.length; i++) {
      if (eval("_myArray[i]." + _rubID).toUpperCase() === _searchID) {
        return i;
      }
    };
    return -1;
  }

  arraySearch2(_searchID, _myArray, _rubID){
    if(!_rubID) {_rubID = "id"; } //default search on "id" member
    for (var i=0; i < _myArray.length; i++) {
        if (eval("_myArray[i]." + _rubID) === _searchID) {
          return i;
        }       
    };
    return -1;
  }
  
  /**
   * Sorting array
   * @param prop 
   */
  predicateBy(prop){
    return function(a,b){
      if( a[prop] > b[prop]){
          return 1;
      }else if( a[prop] < b[prop] ){
          return -1;
      }
      return 0;
    }
  }

  predicateBy2(prop){
    return function(a,b){
      /*if( a[prop] > b[prop]){
          return 1;
      }else if( a[prop] < b[prop] ){
          return -1;
      }
      return 0;*/
      return a[prop] - b[prop];
    }
  }
}
