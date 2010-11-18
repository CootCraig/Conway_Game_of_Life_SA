$(document).ready(function() {
  GAME_OF_LIFE.board = GAME_OF_LIFE.game_board_constructor({});
  GAME_OF_LIFE.board.create_board();
  GAME_OF_LIFE.ui = GAME_OF_LIFE.ui_constructor({});
});
