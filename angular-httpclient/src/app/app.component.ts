import {Component} from '@angular/core';
import {StartService} from './start.service';
import {OnInit} from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  size: number;
  url: string = "http://localhost:8081/minesweeper-service/";
  gameStarted: boolean = false;
  cellOpacity: number = 0.3;
  numberOfRows: number = 8;
  cellColor = [];
  neighborMines = [];
  numOfMines: number = 10;
  alive: boolean = false;
  winner: boolean = false;


  constructor(public Starter: StartService) {
  }

  ngOnInit(){
    this.size = 64;
    let i: number;
    for(i = 0; i < this.size; i++){
      this.cellColor[i] = "lightgrey";
      this.neighborMines[i] = "";
    }
  }

  counter(i: number){
    let arr = new Array(i);
    let j: number;

    for(j = 0; j < i; j++){
      arr[j]=j;
    }
    return arr;
  }

  startGame(rowSize: number, numOfMines: number){

    if(rowSize === undefined) rowSize = 8;
    if(numOfMines === undefined) numOfMines = 10;

    this.Starter.createBoard(rowSize, numOfMines)
      .subscribe(data => this.numberOfRows = data.numberOfRows);

    this.size = this.numberOfRows * this.numberOfRows;
    this.gameStarted = true;
    this.cellOpacity = 1;
    this.numOfMines = numOfMines;

    let i: number;
    for(i = 0; i < this.size; i++){
      this.cellColor[i] = "lightgrey";
      this.neighborMines[i] = "";
    }

    console.log(rowSize, numOfMines, this.numberOfRows, this.size)
  }

  clickCell(cellNum: number){
    if(this.gameStarted && this.cellColor[cellNum] !== "tomato"){
    }
  }

  flagCell(cellNumber: number){

  }
}
