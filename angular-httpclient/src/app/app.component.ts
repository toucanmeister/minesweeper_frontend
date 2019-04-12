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

  size: number = 64;
  numberOfRows: number = 8;
  numberOfMines: number = 10;
  cellOpacity: number = 0.3;
  cellColor = [];
  neighborMines = [];
  gameStarted: boolean = false;
  alive: boolean = true;
  winner: boolean = false;


  constructor(public Starter: StartService, public Clicker: ClickService, public Flagger: FlagService) {
  }

  ngOnInit(){
    let i: number;
    for(i = 0; i < this.size; i++){
      this.cellColor[i] = "lightgrey";
      this.neighborMines[i] = "";
    }
  }

  startGame(event: any){

    let rowInput: number = event.target.rowInput.value;
    let minesInput: number = event.target.minesInput.value;
    this.initializeBoardValues(rowInput, minesInput);
    this.Starter.createBoard(this.numberOfRows, this.numberOfMines).subscribe();
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
    if(this.numberOfMines === 0) return;
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

  inputIsInvalid(rows: number, mines: number): boolean {
      if (rows === undefined || mines === undefined) {
          return true;
      }
      if (rows < 1 || mines < 1) {
          return true;
      }
      if (rows*rows < mines) {
          return true;
      }
      return false;
  }

  initializeBoardValues(rowInput: number, minesInput: number) {
    this.sanitizeAndSetInput(rowInput, minesInput);
    this.size = this.numberOfRows * this.numberOfRows;
    this.gameStarted = true;
    this.cellOpacity = 1;
  }

  private sanitizeAndSetInput(rowInput: number, minesInput: number) {
    if (this.inputIsInvalid(rowInput, minesInput)) {
      this.numberOfRows = 8;
      (<HTMLInputElement>document.getElementById("rowInput")).value = "8";
      this.numberOfMines = 10;
      (<HTMLInputElement>document.getElementById("minesInput")).value = "10";
    } else {
      this.numberOfRows = rowInput;
      this.numberOfMines = minesInput;
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
