# -*- coding: utf-8 -*
from collections import namedtuple
from functools import partial

from bson import ObjectId
from flask import Flask, render_template, url_for
from flask.json import JSONEncoder
from flask_bootstrap import Bootstrap
from flask_login import LoginManager
from flask_principal import Principal, Permission, RoleNeed
from flask_pymongo import PyMongo
from flask_wtf import CSRFProtect
from flask_sqlalchemy import SQLAlchemy



app = Flask(__name__, template_folder="templates", static_folder="static")

Principal(app)
Bootstrap(app)
login_manager = LoginManager(app)

app.config.from_pyfile("config.py")
mongo = PyMongo(app)

# CSRF setting
csrf = CSRFProtect()
csrf.init_app(app)
app.secret_key = "liangzhanning"
app.config["WTF_CSRF_SECRET_KEY"] = app.secret_key
app.config["WTF_CSRF_TIME_LIMIT"] = 7200

db = SQLAlchemy(app)
# login setting
login_manager.login_view = "base.login"  # 用户未登录时候重定向到的登录页面
login_manager.login_message = u"请先登录"  # 用户未登录时候显示的消息
login_manager.login_message_category = "info"  # 显示消息的类表

# authentication setting
# admin_permission = Permission(RoleNeed('admin'))  # 系统管理员需要验证系统管理员角色
# LoginNeed = namedtuple("login_system", ['method', 'value'])  # 可以登录系统
# MonitorNeed = partial(LoginNeed, 'monitor_bbs')  # 可以进入某个子系统
# SettingNeed = partial(LoginNeed, 'set_bbs')  # 可以设置某个子系统

# from database import db_session
#
#
# @app.teardown_request
# def shutdown_session(exception=None):
#     db_session.remove()


# import view from blueprint and register blueprint
import errorhandler

from base import base
from user import user

app.register_blueprint(base, url_prefix='/')
app.register_blueprint(user, url_prefix='/user')
#
# @app.route('/')
# def hello_world():
#     return 'Hello World!'


if __name__ == '__main__':
    app.run()
