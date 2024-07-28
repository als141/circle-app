# openaiのapiで、指定された条件のイベントを生成するコントローラー
# 条件は、どんなイメージのイベントにするか、日時、場所、予算からイベントを自由に提案する
class Api::V1::MakeEventController < ApplicationController
    require 'openai'
    
    def create
      Rails.logger.debug "Params received: #{params.inspect}"
      event_description = params[:description]
      date = params[:date]
      location = params[:location]
      budget = params[:budget]
      Rails.logger.debug "Event description: #{event_description}"
      Rails.logger.debug "Date: #{date}"
      Rails.logger.debug "Location: #{location}"
      Rails.logger.debug "Budget: #{budget}"
      
      if event_description.blank? || date.blank? || location.blank? || budget.blank?
        render json: { error: 'All parameters (description, date, location, budget) are required' }, status: :unprocessable_entity
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
              { role: "system", content: "あなたはイベントプランナーです。以下の条件に基づいて、いくつかの大学サークルイベントを提案してください。出力はそのイベント情報のみで、箇条書きにしてマークダウンで出力してください。" },
              { role: "user", content: "イベントのイメージ: #{event_description}, 日時: #{date}, 場所: #{location}, 予算: #{budget}" }
            ],
            temperature: 0.7,
          }
        )
        Rails.logger.debug "OpenAI API response: #{response.inspect}"
        event_suggestions = response.dig("choices", 0, "message", "content")
        if event_suggestions.blank?
          Rails.logger.error "Failed to generate event suggestions"
          render json: { error: 'Failed to generate event suggestions' }, status: :unprocessable_entity
        else
          Rails.logger.info "Successfully generated event suggestions"
          render json: { event_suggestions: event_suggestions }
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