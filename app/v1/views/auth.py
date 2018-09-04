# app/v1/views/auth

from flask import Blueprint, jsonify, request

auth = Blueprint(
    'auth_blueprint', __name__, url_prefix='/stackoverflowlite/api/v1/auth')


@auth.route('/signup', methods=['POST'])
def user_signup():
    """Method to register a new user"""
    user_info = request.get_json()

    return jsonify({"user": user_info})


@auth.route('/login', methods=['POST'])
def user_login():
    """Method to login a user"""
    user_info = request.get_json()

    return jsonify({"Login info": user_info})
