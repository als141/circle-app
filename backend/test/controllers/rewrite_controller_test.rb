require "test_helper"

class RewriteControllerTest < ActionDispatch::IntegrationTest
  test "should get rewrite" do
    get rewrite_rewrite_url
    assert_response :success
  end
end
