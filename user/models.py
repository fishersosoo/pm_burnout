# coding=utf-8
from core.outputMixin import OutputMixin
from pm_burndown import db
from flask_login import UserMixin


class User(UserMixin, OutputMixin):

    def __init__(self, username):
        self.username = username

    def get_id(self):
        """
        继承UserMixin类登录管理必须

        :return:
        """
        return self.username
