import { Injectable } from '@angular/core';
import {HttpHeaders, HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';

interface Flag {
  alive: boolean;
  winner: boolean;
  numOfNeighborMines: [];
  clickedCells: [];
  mines: [];
  okay: boolean;
}


@Injectable({
  providedIn: 'root'
})
export class FlagService {
  flag: Flag;

  constructor(private http: HttpClient) { }

  sendFlag(cellNum: number){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http
      .post<Flag>("http://localhost:8081/minesweeper-service/flagChange","{\"cellNum\": " + cellNum + "}", httpOptions)
      .pipe(map(data => {
          this.flag = data;
          return this.flag;
        }
      ))
  }
}
