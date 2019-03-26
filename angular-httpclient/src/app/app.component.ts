import {Component} from '@angular/core';
import {StartService} from './start.service';
import {ClickService} from './click.service';
import {OnInit} from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  size: number;
  numberOfRows: number = 8;
  numOfMines: number = 10;

  cellOpacity: number = 0.3;
  cellColor = [];

  neighborMines = [];

  gameStarted: boolean = false;
  alive: boolean = true;
  winner: boolean = false;


  constructor(public Starter: StartService, public Clicker: ClickService) {
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
  }

  clickCell(cellNum: number){

    if(this.gameStarted && this.cellColor[cellNum] !== "tomato"){
      this.Clicker.sendClick(cellNum)
        .subscribe( data => {
          console.log(data);
          if(data.okay) {
            this.alive = data.alive;
            this.winner = data.winner;
            this.displayClickAndNeighborMines(cellNum, data.clickedCells, data.numOfNeighborMines);
          }
          if(!(this.alive) || this.winner){
            this.gameStarted = false;
            this.cellOpacity = 0.3;
            this.showMines(data.mines);
          }
        })
    }
  }

  flagCell(cellNumber: number){

  }

  displayClickAndNeighborMines(cellNum: number, clickedCells: number[], numOfNeighborMines: number[]){
    let i: number;
    for(i = 0; i < clickedCells.length; i++){
      let currentClickedCell = clickedCells[i];
      this.cellColor[currentClickedCell] = "darkgrey";
      if(numOfNeighborMines[i] === 0) {
        this.neighborMines[currentClickedCell] = "";
      } else {
        this.neighborMines[currentClickedCell] = numOfNeighborMines[i].toString();
      }
    }
  }

  showMines(mines: number[]){
    let i: number;
    for(i = 0; i < this.size; i++){
      if(mines.includes(i)){
        this.cellColor[i] = "firebrick";
      }
    }
  }
}
