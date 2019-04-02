import { Injectable } from '@angular/core';
import {HttpHeaders, HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';

interface Click {
  alive: boolean;
  winner: boolean;
  clickedCellsWithMineCount: [][];
  mines: [];
  okay: boolean;
}


@Injectable({
  providedIn: 'root'
})
export class ClickService {
  click: Click;

  constructor(private http: HttpClient) { }

  sendClick(cellNum: number){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http
      .post<Click>("http://localhost:8081/minesweeper-service/click","{\"cellNum\": " + cellNum + "}", httpOptions)
      .pipe(map(data => {
          this.click = data;
          return this.click;
        }
      ))
  }
}
