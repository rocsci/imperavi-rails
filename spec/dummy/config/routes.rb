Rails.application.routes.draw do
  resources :pages
  mount ImperaviRails::Engine => "/imperavi"

  root :to => 'pages#index'
end
