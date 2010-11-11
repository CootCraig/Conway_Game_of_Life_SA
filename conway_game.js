function board(css_id,num_of_rows,num_of_cols) {
  var $board_div = $(css_id);
  var $board_arr = new Array(num_of_rows); // row major $board_arr[row][col]
  for (var row = 0; row < num_of_rows; row++) {
    $board_arr[row] = new Array(num_of_cols);
    var $row_div = $('<div>', {id : 'r' + row, 'class' : 'row' });
    $row_div.appendTo($board_div)
    for (var col = 0; col < num_of_cols; col++) {
      (function(){
        var $col_div = $('<div>', {id : 'g' + row + '_' + col, 'class' : 'sq' });
        $board_arr[row][col] = $col_div;
        set_state($col_div,false,false);
        $col_div.mouseenter(function(){
          set_selected_state($col_div,true);
        });
        $col_div.mouseleave(function(){
          set_selected_state($col_div,false);
        });
        $col_div.click(function(){
          toggle_active_state($col_div);
        });
        $col_div.appendTo($row_div);
      }) ();
    }
  }
  $('#step_button').click(function(){
    next_generation($board_arr);
  });
  $('#clear_button').click(function(){
    clear_board($board_arr);
  });
  $('#run_button').click(function(){
    run_times($board_arr);
  });
}
function remove_state_class(sq_obj) {
  if (sq_obj.hasClass('sq_active_unselected')) {sq_obj.removeClass('sq_active_unselected');}
  if (sq_obj.hasClass('sq_active_selected')) {sq_obj.removeClass('sq_active_selected');}
  if (sq_obj.hasClass('sq_inactive_unselected')) {sq_obj.removeClass('sq_inactive_unselected');}
  if (sq_obj.hasClass('sq_inactive_selected')) {sq_obj.removeClass('sq_inactive_selected');}
}
function set_state_class(sq_obj,state_class) {
  remove_state_class(sq_obj);
  sq_obj.addClass(state_class);
}
function set_state_class_for_data(sq_obj) {
  var class_str = '';
  if (sq_obj.data('active')) {
    if (sq_obj.data('selected')) {
      class_str = 'sq_active_selected';
    } else {
      class_str = 'sq_active_unselected';
    }
  } else {
    if (sq_obj.data('selected')) {
      class_str = 'sq_inactive_selected';
    } else {
      class_str = 'sq_inactive_unselected';
    }
  }
  set_state_class(sq_obj,class_str);
}
function set_state(sq_obj,active,selected) {
  sq_obj.data({'active' : active, 'selected' : selected});
  set_state_class_for_data(sq_obj);
}
function set_selected_state(sq_obj,selected) {
  sq_obj.data({'selected' : selected});
  set_state_class_for_data(sq_obj);
}
function toggle_active_state(sq_obj) {
  if (sq_obj.data('active')) {
    sq_obj.data({'active' : false});
  } else {
    sq_obj.data({'active' : true});
  }
  set_state_class_for_data(sq_obj);
}
function next_generation(board_arr) {
  (function() {
    // Copy current square state to a local array
    var num_of_rows = board_arr.length;
    var num_of_cols = board_arr[0].length;
    var $cells = new Array();
    for (var row = 0; row < num_of_rows; row++) {
      var $cells_for_row = new Array();
      for (var col = 0; col < num_of_cols; col++) {
        if (board_arr[row][col].data('active')) {
          $cells_for_row.push(true);
        } else {
          $cells_for_row.push(false);
        }
      }
      $cells.push($cells_for_row);
    }
    // Using the local square state array, set active true/false for
    // the next generation
    for (var row=0; row < num_of_rows; row++) {
      for (var col=0; col < num_of_cols; col++) {
        var active_neighbors = 0;
        if ((row > 0) && (col > 0) && ($cells[row-1][col-1]))  {
          active_neighbors++;
        }
        if ((row > 0) && ($cells[row-1][col]))  {
          active_neighbors++;
        }
        if ((row > 0) && ((col+1) < num_of_cols) && ($cells[row-1][col+1]))  {
          active_neighbors++;
        }
        if ((col > 0) && ($cells[row][col-1])) {
          active_neighbors++;
        }
        if (((col+1) < num_of_cols) && ($cells[row][col+1])) {
          active_neighbors++;
        }
        if (((row+1) < num_of_rows) && (col > 0) && ($cells[row+1][col-1])) {
          active_neighbors++;
        }
        if (((row+1) < num_of_rows) && ($cells[row+1][col])) {
          active_neighbors++;
        }
        if (((row+1) < num_of_rows) && ((col+1) < num_of_cols) && ($cells[row+1][col+1])) {
          active_neighbors++;
        }
        if ($cells[row][col]) {
          if ((active_neighbors < 2) || (active_neighbors > 3)) {
            board_arr[row][col].data({'active' : false});
            set_state_class_for_data(board_arr[row][col]);
          }
        } else {
          if (active_neighbors == 3) {
            board_arr[row][col].data({'active' : true});
            set_state_class_for_data(board_arr[row][col]);
          }
        }
      }
    }
  }) ();
}
function clear_board(board_arr){
  var num_of_rows = board_arr.length;
  var num_of_cols = board_arr[0].length;
  for (var row=0; row < num_of_rows; row++) {
    for (var col=0;col < num_of_cols; col++) {
      if (board_arr[row][col].data('active')) {
        board_arr[row][col].data({'active' : false});
        set_state_class_for_data(board_arr[row][col]);
      }
    }
  }
}
function run_times(board_arr){
  var step_count = parseInt($('#number_of_steps').val());
  $('#run_button').everyTime(800,
                             function(board_arr) {
                               next_generation(board_arr);
                             },
                             step_count);
}
