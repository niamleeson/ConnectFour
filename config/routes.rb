Rails.application.routes.draw do
  post 'user_token' => 'user_token#create'
  mount_ember_app :frontend, to: "/"
end
