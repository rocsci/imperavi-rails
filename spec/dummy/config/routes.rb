Rails.application.routes.draw do
  mount ImperaviRails::Engine => "/imperavi"

  resources :pages do
    resources :images
  end

  root :to => 'pages#index'
end
