export class TicTacToeDTO {
  gameType: string;
  pieceCode: string;

  constructor(gameType?: string, pieceCode?: string) {
    this.gameType = gameType;
    this.pieceCode = pieceCode;
  }
}
