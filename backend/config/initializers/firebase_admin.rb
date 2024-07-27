require 'firebase-admin'

if Rails.env.production?
  # 本番環境では環境変数から直接読み込む
  credentials = JSON.parse(Base64.decode64(ENV['FIREBASE_CREDENTIALS_BASE64']))
else
  # 開発環境では.envファイルから読み込む
  credentials = JSON.parse(Base64.decode64(ENV['FIREBASE_CREDENTIALS_BASE64']))
end

Firebase::Admin.configure do |config|
  config.project_id = credentials['project_id']
  config.credentials = Google::Cloud::Firestore::Credentials.new(credentials)
end