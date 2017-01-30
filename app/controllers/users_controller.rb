class UsersController < ApplicationController
  def index
    if current_user
      render json: ActiveModelSerializers::SerializableResource.new(current_user, {}).as_json
    else
      render json: { error: 'user not found' }
    end
  end

  def create
    existing_user = User.where(email: params["data"]["attributes"]["email"]).first

    if existing_user.present?
      render json: { error: "User already exists" }, status: 422
    else
      user = User.create(user_params)
      options = {}
      render json: ActiveModelSerializers::SerializableResource.new(user, options).as_json
    end
  end

  def update
    render status: 422
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
