# -*- coding: utf-8 -*
# from flask.ext.restful import reqparse
#
#
# class Argument(reqparse.Argument):
#     """
#     继承自 reqparse.Argument, 增加 nullable 关键字参数，
#     对于值为 None 并且 nullable=False 的字段 raise TypeError
#     """
#     def __init__(self, name, default=None, dest=None, required=False,
#                  ignore=False, type=reqparse.text_type,
#                  location=('json', 'values',), choices=(),
#                  action='store', help=None, operators=('=',),
#                  case_sensitive=True, default=False):
#         self.nullable = nullable
#         super(Argument, self).__init__(name, default=default, dest=dest,
#                                        required=required, ignore=ignore,
#                                        type=type, location=location,
#                                        choices=choices, action=action,
#                                        help=help, operators=operators,
#                                        case_sensitive=case_sensitive)
#
#     def convert(self, value, op):
#         if value is None and not self.nullable:
#             raise TypeError("%s can't be null" % self.name)
#         return super(Argument, self).convert(value, op)

from datetime import datetime

from core import datetime_format
import bcrypt


def _email(email_str):
    def valid_email(str):
        return True

    if valid_email(email_str):
        return email_str
    else:
        raise Exception(F"{email_str} is not a valid email")


class RequestType:
    datetime = lambda x: datetime.strptime(x, datetime_format)
    email = _email
    password = lambda x: bcrypt.hashpw(x.encode(), bcrypt.gensalt(rounds=10, prefix=b'2a'))


def _to_bool(str):
    return str.lower() in ("yes", "true", "t", "1")


type_convert = {
    "bool": _to_bool
}
