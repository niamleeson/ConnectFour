class UsersController < ApplicationController
  def create
    user = User.create(user_params)
    # render json: serialize_model(@contact, {include: "contact-parent"})
    render json: {data: {}}

    # gotta return serialized user account
  end

  private

  def user_params
    params.permit(:first_name, :last_name, :email, :password, :password_confirmation)
    # params.require(:user).permit(:first_name, :last_name, :email, :password, :password_confirmation)    
  end
end
