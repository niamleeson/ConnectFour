class CreateBoards < ActiveRecord::Migration[5.0]
  def change
    create_table :boards do |t|
      t.text :board_state
      t.text :open_cols

      t.timestamps
    end
  end
end
