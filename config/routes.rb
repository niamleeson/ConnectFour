Rails.application.routes.draw do
  resources :users
  resources :boards
  post 'user_token' => 'user_token#create'
  mount_ember_app :frontend, to: "/"

  post 'solve', to: 'boards#solve'
  get 'load_games', to: 'boards#load_games'
end
