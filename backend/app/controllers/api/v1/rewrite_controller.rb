class Api::V1::RewriteController < ApplicationController
  require 'openai'

  def create
    Rails.logger.debug "Params received: #{params.inspect}"
    
    original_text = params[:text]
    tone = params[:tone] || 'フレンドリーで絵文字も使う'

    Rails.logger.debug "Original text: #{original_text}"
    Rails.logger.debug "Tone: #{tone}"

    if original_text.blank?
      render json: { error: 'Text parameter is required' }, status: :unprocessable_entity
      return
    end

    begin
      Rails.logger.debug "Initializing OpenAI client"
      client = OpenAI::Client.new(access_token: ENV['OPENAI_API_KEY'])

      Rails.logger.debug "Sending request to OpenAI API"
      response = client.chat(
        parameters: {
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "あなたは指定されたトーンでテキストをリライトする優秀なアシスタントです。リライトしたテキストのみ出力してください。" },
            { role: "user", content: "次のテキストをリライトしてください。 #{tone} tone: #{original_text}" }
          ],
          temperature: 0.7,
        }
      )

      Rails.logger.debug "OpenAI API response: #{response.inspect}"

      rewritten_text = response.dig("choices", 0, "message", "content")

      if rewritten_text.blank?
        Rails.logger.error "Failed to generate rewritten text"
        render json: { error: 'Failed to generate rewritten text' }, status: :unprocessable_entity
      else
        Rails.logger.info "Successfully rewrote text"
        render json: { original_text: original_text, rewritten_text: rewritten_text, tone: tone }
      end
    rescue OpenAI::Error => e
      Rails.logger.error "OpenAI API error: #{e.message}"
      render json: { error: "OpenAI API error: #{e.message}" }, status: :unprocessable_entity
    rescue StandardError => e
      Rails.logger.error "An unexpected error occurred: #{e.message}"
      Rails.logger.error e.backtrace.join("\n")
      render json: { error: "An unexpected error occurred: #{e.message}" }, status: :internal_server_error
    end
  end
end