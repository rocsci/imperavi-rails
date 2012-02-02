Rails.application.routes.draw do
  mount ImperaviRails::Engine => "/imperavi"

  resources :images, :only => [:index, :create]
  resources :pages

  root :to => 'pages#index'
end
