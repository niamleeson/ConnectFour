Rails.application.routes.draw do
  resources :users
  resources :boards
  post 'user_token' => 'user_token#create'
  mount_ember_app :frontend, to: "/"

  post 'solve', to: 'boards#solve'
  # post 'save_game', to: 'boards#save_game'
  # get 'users/me', to: 'users#current_user'
end
