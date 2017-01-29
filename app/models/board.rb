class Board < ApplicationRecord
  serialize :board_state, Array
  serialize :open_cols, Array
end
