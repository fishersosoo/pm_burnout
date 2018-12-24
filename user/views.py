# -*- coding: utf-8 -*
import uuid

from flask import request
from flask_restful import Api, Resource, reqparse

from core import datetime_format
from core.json_response import jsonfy
from core.request_argument import RequestType, type_convert
from pm_burndown import db
from user import user
from user.forms import NewUserForm
from user.models import User
import datetime

user_api = Api(user)


class UserAPI(Resource):
    get_parser = reqparse.RequestParser()
    get_parser.add_argument("")

    def get(self):
        users = User.query.all()
        # print(users.toJSON())
        return users, 200

    put_parser = reqparse.RequestParser()
    put_parser.add_argument("username", type=str, required=True)
    put_parser.add_argument("showname", type=str, required=True)
    put_parser.add_argument("password", type=RequestType.password, required=True)
    put_parser.add_argument("question", type=str)
    put_parser.add_argument("answer", type=str)
    put_parser.add_argument("description", type=str)
    put_parser.add_argument("email", type=RequestType.email)
    put_parser.add_argument("password_set_time", type=RequestType.datetime, default=datetime.datetime.now())
    put_parser.add_argument("last_login_time", type=RequestType.datetime)
    put_parser.add_argument("enabled", type=bool, default=True)
    put_parser.add_argument("account_non_expired", type=bool, default=False)
    put_parser.add_argument("credentials_non_expired", type=bool, default=False)
    put_parser.add_argument("account_non_locked", type=bool, default=False)
    put_parser.add_argument("default_url", type=str)

    def put(self):
        args = self.put_parser.parse_args()
        create_user_form = NewUserForm()
        for field in create_user_form.fields:
            field.process_data(args[field.name])
            if field.validate(create_user_form) is False:
                print(field.errors)
                return {"message": F"{field.name}:{','.join(field.errors)}"}, 400

        new_user = User(**args)
        new_user.id = str(uuid.uuid1())
        if User.query.filter(User.username == new_user.username).one_or_none() is not None:
            return {"message": F"username:{new_user.username} exists"}, 400
        db.session.add(new_user)
        db.session.commit()
        return {"message": "创建用户成功"}, 200

    post_parser = reqparse.RequestParser()
    post_parser.add_argument("pk", type=str)
    post_parser.add_argument("name", type=str)
    post_parser.add_argument("value", type=str)
    post_parser.add_argument("type", type=str)

    def post(self):
        args = self.post_parser.parse_args()
        User.query.filter(User.id == args['pk']).update({args['name']: type_convert[args['type']](args['value'])})
        db.session.commit()
        return {"message": "更新成功"}, 200

    delete_parser = reqparse.RequestParser()
    delete_parser.add_argument("id", type=str)

    def delete(self):
        args = self.delete_parser.parse_args()
        user = User.query.filter(User.id == args['id']).one()
        db.session.delete(user)
        db.session.commit()
        return {"message": "删除成功"}, 200


user_api.add_resource(UserAPI, "/")
