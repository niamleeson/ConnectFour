class BoardSerializer < ActiveModel::Serializer
  attributes :id,
             :name,
             :board_state,
             :open_cols
end