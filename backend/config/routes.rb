Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      post 'rewrite', to: 'rewrite#create'
    end
  end
end