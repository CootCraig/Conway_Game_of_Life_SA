$(document).ready(function() {
  GAME_OF_LIFE.board = GAME_OF_LIFE.game_board_constructor({row_count: 40, col_count:40});
  GAME_OF_LIFE.board.create_board();
  GAME_OF_LIFE.ui = GAME_OF_LIFE.ui_constructor({});
});
