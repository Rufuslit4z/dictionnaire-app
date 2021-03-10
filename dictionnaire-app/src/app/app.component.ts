import { Component } from '@angular/core';
import { HttpClient } from "@angular/common/http";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
	
	api_baseURL = "https://api.dictionaryapi.dev/api/v2/entries/fr/";

	data        :      any = [];
	definitions : string[] = [];
	synonymes   : string[] = [];


	word: string = "";

	selection_2017 = ["Oligarchie", "Ergonome", "Régalien", "PMA", "Assomption"];
	          date = 2017;
	selection_str  = "Les termes les plus recherchés sur le net en " + this.date.toString();

	constructor(private http: HttpClient){ 
		
	}

  	onClickSubmit(word:string){
  		this.setWord(this.toUpper(0, word["search"].toString()));
  		this.searchDefinition(this.word);
  	}

	searchDefinition(word:string){
		if(this.data.length > 0) {
			this.data.forEach((value:string,index:number)=> {
				this.data.splice(index);
			})
		}
		this.http.get(this.api_baseURL+word).subscribe((res)=>{
			this.data = res;
		});
	}

	getSelectionWord(selection:string) {
		console.log((<HTMLInputElement>document.getElementById(selection)).id);
		this.http.get(this.api_baseURL+selection).subscribe((res)=>{
			this.data = res;
		})
		this.setWord(selection);
	}

	getWord() : string {
		return this.word;
	}

	setWord(word:string){
		this.word = word;
	}

	getDefObject(data:any) : any[] {
		let id = 0;
		let objets = [];

		this.resetArray(this.synonymes);

		//console.log("=====================");		
		//console.log(data);

		for(let key in data){
		/*
		*	REDONDANCE DE DONNEES
		*	DOUBLON POUR LA NATURE GRAMMATICALE
		*/
			let objet = { 
				"natures"     : [""],
				"definitions" : [""],
				"exemples"    : [""],
				"synonymes"   : [""]
			};

			this.resetArray(objet.natures);
			this.resetArray(objet.definitions);
			this.resetArray(objet.exemples);
			this.resetArray(objet.synonymes);
			// console.log("key : " + key);

			for(let defOrNature in data[key]["meanings"]){
				// console.log("defOrNature : " + defOrNature);
				for(let nature in data[key]["meanings"][defOrNature]){
					if(typeof(data[key]["meanings"][defOrNature].partOfSpeech) !== "undefined"){
						//console.log("nature : " + data[key]["meanings"][defOrNature].partOfSpeech);
						objet.natures.push(data[key]["meanings"][defOrNature].partOfSpeech);
					}
				}
				for(let defKey in data[key]["meanings"][defOrNature]["definitions"]){
					if(typeof(data[key]["meanings"][defOrNature]["definitions"][defKey].definition) !== "undefined"){
						//console.log("def : " + data[key]["meanings"][defOrNature]["definitions"][defKey].definition);
						objet.definitions.push(data[key]["meanings"][defOrNature]["definitions"][defKey].definition);
					}
					

					if(typeof(data[key]["meanings"][defOrNature]["definitions"][defKey].example) !== "undefined"){
						//console.log("exemple : " + data[key]["meanings"][defOrNature]["definitions"][defKey].example);
						objet.exemples.push(data[key]["meanings"][defOrNature]["definitions"][defKey].example);
					}

					for(let synonymKey in data[key]["meanings"][defOrNature]["definitions"][defKey]["synonyms"]){
						if(typeof(data[key]["meanings"][defOrNature]["definitions"][defKey]["synonyms"][synonymKey]) !== "undefined"){
							// this.appendElement(this.synonymes, data[key]["meanings"][defOrNature]["definitions"][defKey]["synonyms"][synonymKey]);
							objet.synonymes.push(data[key]["meanings"][defOrNature]["definitions"][defKey]["synonyms"][synonymKey]);
						}
					}
				}
				//console.log("objet individuel : ");
				//console.log(objet);
				objets.push(objet);
				//console.log("----");
			}
		}
		//console.log("Tableau d'objet");
		//console.log(objets);
		return objets;
	}


	// Transformer la première lettre en majuscule
	toUpper(index: number, word:string) : string {
		return word[index].toUpperCase() + word.substr(1).toLowerCase();
	}

	resetArray(array : string []){
		array.forEach((value:string,index:number)=> {
				array.splice(index);
		})
	}

	appendElement(array : string[], something : any){
		array.push(something);
	}
}
