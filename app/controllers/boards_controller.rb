class BoardsController < ApplicationController
  def create
    user = User.find(params["data"]["relationships"]["user"]["data"]["id"].to_i)
    board = Board.new(board_params)
    board.user = user
    board.save!

    render json: ActiveModelSerializers::SerializableResource.new(board, {}).as_json
  end

  def destroy
    board = Board.find(params["id"].to_i)
    board.destroy

    render status: 204
  end

  def load_games
    user = User.find(params["user_id"].to_i)
    boards = Board.where(user: user).all

    render json: ActiveModelSerializers::SerializableResource.new(boards, {}).as_json
  end

  def solve
    # need a better way to get a multidimensional array from ruby strong parameter
    @board = Array.new(6) 
    @board[0] = params[:board]["0"].map{|i| i.to_i}
    @board[1] = params[:board]["1"].map{|i| i.to_i}
    @board[2] = params[:board]["2"].map{|i| i.to_i}
    @board[3] = params[:board]["3"].map{|i| i.to_i}
    @board[4] = params[:board]["4"].map{|i| i.to_i}
    @board[5] = params[:board]["5"].map{|i| i.to_i}
    
    @open_cols = params[:open_cols].map{|i| i.to_i}
    @last_move = params[:last_move].to_i
    @column = params[:column].to_i
    @difficulty = params[:difficulty].to_i

    #first check if someone already won
    #if so, render json with win status and winning combo
    #if not, solve for best move
    if rate_board(false) == Float::INFINITY
      winning_combo = find_winning_combo(@last_move, 2)
      win_status = 2
      render json: {best_move: nil, win_status: win_status, winning_combo: winning_combo}
    elsif rate_board(false) == -Float::INFINITY
      winning_combo = find_winning_combo(@last_move, 1)
      win_status = 1
      render json: {best_move: nil, win_status: win_status, winning_combo: winning_combo}      
    else
      data = solve_best_move(@board, @open_cols, @column, @difficulty)
      render json: data      
    end
  end

  private

  def board_params
    data = {}
    data[:name] = params["data"]["attributes"]["name"]
    data[:board_state] = params["data"]["attributes"]["board-state"]
    data[:open_cols] = params["data"]["attributes"]["open-cols"]

    return data
  end

  def solve_best_move(board, open_cols, column, difficulty)
    @best_move = 0
    @alpha = -Float::INFINITY
    @beta = Float::INFINITY
    
    best_score = minimax(difficulty, @alpha, @beta, true)

    return {best_move: @best_move, win_status: nil, winning_combo: nil}
  end

  def minimax(depth, alpha, beta, is_comp)
    score = rate_board(is_comp)

    if depth == 0 || score == Float::INFINITY || score === -Float::INFINITY
      return score  
    end

    if is_comp
      scores = Array.new(7)

      for c in 0..(@board[0].length - 1)
        r = @open_cols[c]

        if r < 0
          next
        end

        @board[r][c] = 2
        @open_cols[c] -= 1

        alpha = [alpha, minimax(depth - 1, alpha, beta, false)].max

        scores[c] = alpha

        @board[r][c] = 0
        @open_cols[c] += 1

        if beta <= alpha
          break
        else
          next
        end
      end

      if depth == @difficulty
        max_so_far = -Float::INFINITY
        last_valid_move = nil

        for i in 0..(scores.length - 1)
          saved_score = scores[i]

          if saved_score != nil
            if saved_score > max_so_far
              max_so_far = saved_score
              @best_move = i
            end

            last_valid_move = i
          end  
        end

        if max_so_far == -Float::INFINITY
          @best_move = last_valid_move  
        end
      end

      return alpha  
    else
      for c in 0..(@board[0].length - 1)
        r = @open_cols[c]

        if r < 0
          next  
        end

        @board[r][c] = 1
        @open_cols[c] -= 1

        beta = [beta, minimax(depth - 1, alpha, beta, true)].min

        @board[r][c] = 0
        @open_cols[c] += 1

        if beta <= alpha
          break
        else
          next
        end
      end

      return beta
    end
  end

  def find_winning_combo(last_move, player)
    height = @board.length
    width = @board[0].length
    row = @open_cols[last_move] + 1
    @board[row][last_move] = player
    sub_str = player.to_s * 4

    winning_combos = []
    #check horizontal
    h_loc = @board[row].join().index(sub_str)
    if h_loc.present?
      winning_combos.push([row, h_loc], [row, h_loc + 1], [row, h_loc + 2], [row, h_loc + 3])
    end

    #check vertical
    vert_str = ''
    for r in 0..(height - 1)
      vert_str += @board[r][last_move].to_s
    end
    v_loc = vert_str.index(sub_str)
    if v_loc.present?
      winning_combos.push([v_loc, last_move], [v_loc + 1, last_move], [v_loc + 2, last_move], [v_loc + 3, last_move])      
    end

    #check top-left to bottom-right diagonal
    tl_str = ''
    loc = []
    r = row
    c = last_move
    while r > 0 && c > 0
      r -= 1
      c -= 1
    end

    while r < height && c < width
      tl_str += @board[r][c].to_s
      loc.push([r,c])
      r += 1
      c += 1
    end

    diag_loc = tl_str.index(sub_str)
    if diag_loc.present?
      winning_combos.push(loc[diag_loc], loc[diag_loc + 1], loc[diag_loc + 2], loc[diag_loc + 3])      
    end

    #check top-right to bottom-left diagonal
    tr_str = ''
    loc = []
    r = row
    c = last_move
    while r >= 0 && c < width
      r -= 1
      c += 1
    end
    
    while r < height && c >= 0
      tr_str += @board[r][c].to_s
      loc.push([r,c])
      r += 1
      c -= 1
    end

    diag_loc = tr_str.index(sub_str)
    if diag_loc.present?
      winning_combos.push(loc[diag_loc], loc[diag_loc + 1], loc[diag_loc + 2], loc[diag_loc + 3])
    end

    return winning_combos
  end

  def rate_board(is_comp)
    score = 0
    state = check_horizontal(@board) + check_vertical(@board) + check_diagonal(@board)

    if get_sub_str_count(state, '2222') > 0
      return Float::INFINITY
    end

    if get_sub_str_count(state, '1111') > 0
      return -Float::INFINITY
    end

    patterns = patterns()
    patterns.each do |item|
      score += get_sub_str_count(state, item[:pattern]) * item[:score]
    end

    return score
  end

  def check_horizontal(board)
    result = ''
    height = board.length
    width = board[0].length

    for r in 0..(height - 1)
      result += board[r].join('')
      result += '.'
    end

    return result
  end

  def check_vertical(board)
    result = ''
    height = board.length
    width = board[0].length

    for c in 0..(width - 1)
      r = 0

      while r < height
        result += board[r][c].to_s
        r += 1
      end

      result += '.'
    end

    return result
  end

  def check_diagonal(board)
    result = ''
    height = board.length
    width = board[0].length

    for c in 0..(width - 1)
      row = 0
      col = c

      while col >= 0 && row < height
        result += board[row][col].to_s
        row += 1
        col -= 1
      end

      result += '.'
    end

    for r in 1..(height - 1)
      col = width - 1
      row = r

      while col >= 0 && row < height
        result += board[row][col].to_s
        row += 1
        col -= 1
      end

      result += '.'
    end

    for c in 0..(width - 1)
      row = 0
      col = width-1 - c

      while col < width && row < height
        result += board[row][col].to_s
        row += 1
        col += 1  
      end
      
      result += '.'
    end

    for r in 1..(height - 1)
      col = 0
      row = r

      while col < width && row < height
        result += board[row][col].to_s
        row += 1
        col += 1
      end

      result += '.'
    end

    return result
  end

  def get_sub_str_count(str, sub_str)
    if sub_str.length == 0
      return 0
    end

    count = 0
    pos = 0
    step = sub_str.length

    while true
      pos = str.index(sub_str, pos)

      if pos != nil && pos >= 0
        count += 1
        pos += step
      else
        break
      end
    end

    return count
  end

  def print_board(board)
    rows = board.length
    cols = board[0].length
    result = ''

    for r in 0..(rows - 1)
      result += '|'
      for c in 0..(cols - 1)
        if board[r][c] == 1
          result += ' o '
        elsif board[r][c] == 2
          result += ' x '
        else
          result += '   '
        end
        result += '|'
      end
      result += '\n'
    end

    return result
  end

  def insert(col, player)
    open_col = @open_cols[col]

    if open_col >= 0
      @board[open_col][col] = player
      @open_cols[col] -= 1
    end
  end
  
  def patterns
    return [
      {
        pattern: '1100',
        score: -10
      },
      {
        pattern: '0011',
        score: -10
      },
      {
        pattern: '0110',
        score: -20
      },
      {
        pattern: '1110',
        score: -50
      },
      {
        pattern: '1101',
        score: -50
      },
      {
        pattern: '1011',
        score: -50
      },
      {
        pattern: '0111',
        score: -50
      },
      {
        pattern: '01110',
        score: -100
      },
      {
        pattern: '2200',
        score: 10
      },
      {
        pattern: '0022',
        score: 10
      },
      {
        pattern: '0220',
        score: 20
      },
      {
        pattern: '2220',
        score: 50
      },
      {
        pattern: '2202',
        score: 50
      },
      {
        pattern: '2022',
        score: 50
      },
      {
        pattern: '0222',
        score: 50
      },
      {
        pattern: '02220',
        score: 100
      }
    ]
  end

end
