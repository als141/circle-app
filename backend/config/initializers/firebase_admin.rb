require 'firebase-admin-sdk'

firebase_credentials = ENV['FIREBASE_ADMIN_SDK_CREDENTIALS']
if firebase_credentials.nil? || firebase_credentials.empty?
  Rails.logger.error 'FIREBASE_ADMIN_SDK_CREDENTIALS environment variable is not set or empty'
else
  begin
    decoded_credentials = Base64.decode64(firebase_credentials)
    credentials = StringIO.new(decoded_credentials)
    Firebase::Admin::Credentials.from_json(credentials)
    Firebase::Admin.configure
  rescue => e
    Rails.logger.error "Failed to initialize Firebase Admin SDK: #{e.message}"
  end
end