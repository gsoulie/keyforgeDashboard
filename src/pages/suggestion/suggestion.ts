import { Observable } from 'rxjs';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
import { DataProvider } from './../../providers/data/data';
import { NgForm } from '@angular/forms';
import { Component } from '@angular/core';
import { cst } from '../../models/constantes';

@Component({
  selector: 'page-suggestion',
  templateUrl: 'suggestion.html',
})
export class SuggestionPage {

  dataList: AngularFireList<any>;
  suggestions: Observable<any[]>;
  
  constructor(private dataService: DataProvider, private afDB: AngularFireDatabase) {
    this.dataList = this.afDB.list(cst.TBL_SUGGESTIONS);
    this.suggestions = this.dataList.valueChanges();
  }

  onAddSuggestion(f: NgForm){
    if(f.value.suggestion === ""){
      return;
    }

    this.dataService.addNewSuggestion(f.value.suggestion)
    f.reset();
  }

  onCheckSuggestion(item){
    this.dataList.update(item.id, {etat: !item.etat});
  }

}
