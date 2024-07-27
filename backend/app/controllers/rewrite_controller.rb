# app/controllers/rewrite_controller.rb
require 'openai'

class RewriteController < ApplicationController
  def rewrite
    original_text = params[:text]
    
    client = OpenAI::Client.new(access_token: ENV['OPENAI_API_KEY'])
    
    response = client.chat(
      parameters: {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant that rewrites text." },
          { role: "user", content: "Please rewrite the following text: #{original_text}" }
        ],
        temperature: 0.7,
      }
    )
    
    rewritten_text = response.dig("choices", 0, "message", "content")
    
    render json: { original: original_text, rewritten: rewritten_text }
  end
end