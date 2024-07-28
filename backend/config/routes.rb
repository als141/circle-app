Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      post 'rewrite', to: 'rewrite#create'
      post 'make_event', to: 'make_event#create'
    end
  end
end