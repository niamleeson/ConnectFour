class UsersController < ApplicationController
  def create
    user = User.create(user_params)
    options = {}
    render json: ActiveModelSerializers::SerializableResource.new(user, options).as_json
  end

  private

  def user_params
    data = {}
    data[:first_name] = params["data"]["attributes"]["first-name"]
    data[:last_name] = params["data"]["attributes"]["last-name"]
    data[:email] = params["data"]["attributes"]["email"]
    data[:password] = params["data"]["attributes"]["password"]
    data[:password_confirmation] = params["data"]["attributes"]["password-confirmation"]

    return data
  end
end
