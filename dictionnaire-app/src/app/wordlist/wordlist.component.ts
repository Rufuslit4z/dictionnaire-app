import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";


@Component({
  selector: 'app-wordlist',
  templateUrl: './wordlist.component.html',
  styleUrls: ['./wordlist.component.scss']
})
export class WordlistComponent implements OnInit {

	api_baseURL = "https://api.dictionaryapi.dev/api/v2/entries/fr/";
	data:any = [];
    
  	constructor(private http: HttpClient) {

  	}

	ngOnInit(): void {

	}

	searchDefinition(word:string){
		this.http.get(this.api_baseURL+word).subscribe((res)=>{
			this.data = res;
			console.log(this.data);
		})
	}
}
