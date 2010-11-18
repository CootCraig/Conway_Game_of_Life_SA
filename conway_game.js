var GAME_OF_LIFE = {};

// GAME_OF_LIFE.square_constructor({'row_div': row_div, 'square_class': square_class,
// 'row_index': row_index, 'col_index': col_index});
//
// Construct a square for the game board.
// Append it to row_div (row_div is a JQuery element)
// Attach events for mouseenter,mouseleave,click
// Return a function with public methods that access the square:
//   is_alive() => true | false
//   set_alive(alive_or_dead)
GAME_OF_LIFE.square_constructor = function(spec){
  var alive,col_div,col_index,is_active,row_div,row_index,square_class,square_div,square_id,that;
  var remove_state_class,selected,set_alive,set_state_class,set_state_class_for_data;
  var set_state,set_selected_state,toggle_alive_state;

  spec = spec || {};
  row_index = spec.row_index || 0; // no good default. used to construct div id
  col_index = spec.col_index || 0; // no good default. used to construct div id
  row_div = spec.row_div; // expect a JQuery element that the square will be appended to
  square_class =  spec.square_class || 'sq';

  square_id = 'g' + row_index + '_' + col_index;
  square_div = $('<div>', {id : square_id, 'class' : square_class });

  alive = false;
  selected = false;

  that = {};

  square_div.mouseenter(function(){
    set_selected_state(true);
  });
  square_div.mouseleave(function(){
    set_selected_state(false);
  });
  square_div.click(function(){
    toggle_alive_state();
  });

  square_div.appendTo(row_div);

  is_alive = function(){return alive;};
  that.is_alive = is_alive;

  set_alive = function(alive_or_dead){
    if (alive !== alive_or_dead) {
      alive = alive_or_dead;
      set_state_class_for_data();
    }
  };
  that.set_alive = set_alive;

  remove_state_class = function(){
    square_div.removeClass('sq_active_unselected');
    square_div.removeClass('sq_active_selected');
    square_div.removeClass('sq_inactive_unselected');
    square_div.removeClass('sq_inactive_selected');
  };
  set_state_class = function(state_class){
    remove_state_class();
    square_div.addClass(state_class);
  };
  set_state_class_for_data = function(){
    var class_str;
    if (alive) {
      if (selected) {
        class_str = 'sq_active_selected';
      } else {
        class_str = 'sq_active_unselected';
      }
    } else {
      if (selected) {
        class_str = 'sq_inactive_selected';
      } else {
        class_str = 'sq_inactive_unselected';
      }
    }
    set_state_class(class_str);
  };
  set_state = function(is_alive,is_selected){
    if((alive !== is_alive) || (selected !== is_selected)) {
      alive = is_alive;
      selected = is_selected;
      set_state_class_for_data();
    }
  };
  set_selected_state = function(is_selected){
    if (selected !== is_selected) {
      selected = is_selected;
      set_state_class_for_data();
    }
  };
  toggle_alive_state = function(){
    alive = alive ? false : true;
    set_state_class_for_data();
  };
  set_state_class_for_data();
  return that;
};

GAME_OF_LIFE.game_board_constructor = function(spec){
  var board_div,board_div_name,board_squares,col_count;
  var clear_board,create_board,next_generation,row_count,step_delay_msec,steps_left,that;

  board_div_name = spec.board_div_name || '#board';
  row_count = spec.row_count || 20;
  col_count = spec.col_count || 20;
  step_delay_msec = spec.step_delay_msec || 50;

  that = function(){};

  square_constructor = GAME_OF_LIFE.square_constructor;
  that.square_constructor = square_constructor;

  create_board = function(){
    var col,row,row_div,row_squares;
    board_div = $(board_div_name.indexOf('#') === 0 ? board_div_name : '#' + board_div_name);
    board_div.empty();
    board_squares = [];
    for (row=0; row<row_count; row+=1){
      row_div = $('<div>', {id : 'r' + row, 'class' : 'row' });
      row_squares = [];
      for (col=0; col<col_count; col+=1){
        row_squares.push(square_constructor({
          'row_div': row_div,
          'row_index': row,
          'col_index': col
        }));
      }
      row_div.appendTo(board_div);
      board_squares.push(row_squares);
    }
  };
  that.create_board = create_board;
  
  clear_board = function(){
    var row,square
    if ((board_squares) && (board_squares.length > 0) && (board_squares[0].length > 0)) {
      for (row=0; row<row_count; row+=1){
        for (col=0; col<col_count; col+=1) {
          board_squares[row][col].set_alive(false);
        }
      }
    }4
  };
  that.clear_board = clear_board;

  animate = function(num_of_steps){
    steps_left = num_of_steps
    animation_step();
  };
  that.animate = animate;

  animation_step = function() {
    if (steps_left > 0) {
      next_generation();
      steps_left -= 1;
      $("#number_of_steps").val(steps_left)
      setTimeout(animation_step,step_delay_msec);
    }
  };

  next_generation = function(){
    var alive_neighbors,col,last_state,row,row_state;
    if (true)  {
      // Copy current square state to a local array
      last_state = [];
      for (row=0; row<row_count; row+=1){
        row_state = [];
        for (col=0; col<col_count; col+=1){
          row_state.push(board_squares[row][col].is_alive());
        }
        last_state.push(row_state);
      }
      for (row=0; row<row_count; row+=1){
        for (col=0; col<col_count; col += 1) {
          alive_neighbors = 0;
          if ((row > 0) && (col > 0) && (last_state[row-1][col-1]))  {
            alive_neighbors++;
          }
          if ((row > 0) && (last_state[row-1][col]))  {
            alive_neighbors++;
          }
          if ((row > 0) && ((col+1) < col_count) && (last_state[row-1][col+1]))  {
            alive_neighbors++;
          }
          if ((col > 0) && (last_state[row][col-1])) {
            alive_neighbors++;
          }
          if (((col+1) < col_count) && (last_state[row][col+1])) {
            alive_neighbors++;
          }
          if (((row+1) < row_count) && (col > 0) && (last_state[row+1][col-1])) {
            alive_neighbors++;
          }
          if (((row+1) < row_count) && (last_state[row+1][col])) {
            alive_neighbors++;
          }
          if (((row+1) < row_count) && ((col+1) < col_count) && (last_state[row+1][col+1])) {
            alive_neighbors++;
          }
          if (last_state[row][col]) {
            if ((alive_neighbors < 2) || (alive_neighbors > 3)) {
              board_squares[row][col].set_alive(false);
            }
          } else {
            if (alive_neighbors == 3) {
              board_squares[row][col].set_alive(true);
            }
          }
        }
      }
    }
  };
  that.next_generation = next_generation;

  return that;
};
GAME_OF_LIFE.ui_constructor = function(){
  $('#step_button').click(function(){
    GAME_OF_LIFE.board.next_generation();
  });
  $("#run_button").click(function(){
    GAME_OF_LIFE.board.animate(parseInt($("#number_of_steps").val()));
  });
  $('#clear_button').click(function(){
    GAME_OF_LIFE.board.clear_board();
  });
};
