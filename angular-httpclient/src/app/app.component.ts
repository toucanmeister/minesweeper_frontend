import {Component} from '@angular/core';
import {StartService} from './start.service';
import {ClickService} from './click.service';
import {FlagService} from './flag.service';
import {OnInit} from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  inputNumberOfRows: number = 8;
  inputNumberOfMines: number = 10;

  size: number;
  numberOfRows: number = 8;
  numOfMines: number = 10;

  cellOpacity: number = 0.3;
  cellColor = [];

  neighborMines = [];

  gameStarted: boolean = false;
  alive: boolean = true;
  winner: boolean = false;


  constructor(public Starter: StartService, public Clicker: ClickService, public Flagger: FlagService) {
  }

  ngOnInit(){
    this.size = 64;
    let i: number;
    for(i = 0; i < this.size; i++){
      this.cellColor[i] = "lightgrey";
      this.neighborMines[i] = "";
    }
  }

  startGame(){

    if(this.inputNumberOfRows === undefined ||
       this.inputNumberOfRows === null ||
       this.inputNumberOfRows*this.inputNumberOfRows < this.inputNumberOfMines ||
       this.inputNumberOfRows < 1) {
        this.inputNumberOfRows = 8;
    }
    if(this.inputNumberOfMines === undefined ||
      this.inputNumberOfMines === null ||
      this.inputNumberOfRows*this.inputNumberOfRows < this.inputNumberOfMines ||
      this.inputNumberOfMines < 1) {
        this.inputNumberOfMines = 10;
    }

    this.Starter.createBoard(this.inputNumberOfRows, this.inputNumberOfMines).subscribe();
    this.numberOfRows = this.inputNumberOfRows;
    this.numOfMines = this.inputNumberOfMines;
    this.size = this.inputNumberOfRows * this.inputNumberOfRows;
    this.gameStarted = true;
    this.cellOpacity = 1;
    this.numOfMines = this.inputNumberOfMines;

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
          if(data.okay){
            this.alive = data.alive;
            this.winner = data.winner;
            this.displayClickAndNeighborMines(cellNum, data.clickedCellsWithMineCount);
          }
          if(!(this.alive) || this.winner){
            this.gameStarted = false;
            this.cellOpacity = 0.3;
            if(!this.winner) {
              this.showMines(data.mines);
            }
          }
        })
    }
  }

  flagCell(cellNum: number){
    if(this.gameStarted){
      this.Flagger.sendFlag(cellNum)
        .subscribe(data => {
          if(data.okay){
            this.winner = data.winner;
            this.changeFlaggedCellColors(cellNum);
          }
          if(this.winner){
            this.gameStarted = false;
            this.cellOpacity = 0.3;
          }
        })
    }

  }

  displayClickAndNeighborMines(cellNum: number, clickedCellsWithMineCount: number[][]){
    let i: number;
    for(i = 0; i < clickedCellsWithMineCount[0].length; i++){
      let currentClickedCell = clickedCellsWithMineCount[0][i];
      this.cellColor[currentClickedCell] = "darkgrey";
      if(clickedCellsWithMineCount[1][i] === 0) {
        this.neighborMines[currentClickedCell] = "";
      } else {
        this.neighborMines[currentClickedCell] = clickedCellsWithMineCount[1][i].toString();
      }
    }
  }

  showMines(mines: number[]){
    if(this.numOfMines === 0) return;
    let i: number;
    for(i = 0; i < this.size; i++){
      if(mines.includes(i)){
        this.cellColor[i] = "firebrick";
      }
    }
  }

  changeFlaggedCellColors(cellNum: number){
    if(this.cellColor[cellNum] === "tomato"){
      this.cellColor[cellNum] = "lightgrey";
    } else if(this.cellColor[cellNum] === "lightgrey") {
      this.cellColor[cellNum] = "tomato";
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
}
