# config/routes.rb
Rails.application.routes.draw do
  post 'rewrite', to: 'rewrite#rewrite'
end