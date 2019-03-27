import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

interface Start {
  size: number;
  numberOfRows: number;
  numberOfMines: number;
}

@Injectable({
  providedIn: 'root'
})
export class StartService {
  start: Start;

  constructor(private http:HttpClient) { }

  createBoard(rowSize: number, numOfMines: number): Observable<Start>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    console.log(rowSize, numOfMines);
    return this.http
      .post<Start>("http://localhost:8081/minesweeper-service/start","{\"rowSize\": " + rowSize + ", \"numOfMines\": " + numOfMines + "}", httpOptions)
      .pipe(map(data => {
        this.start = data;
        return this.start;
        }
      ))
  }
}
