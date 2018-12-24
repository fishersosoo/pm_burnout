# -*- coding: utf-8 -*
from flask import Response
import datetime
import json
from bson import ObjectId

from core import datetime_format


class JSONResponse(Response):
    """
    返回 JSON 数据的的响应
    """

    def __init__(self, data, **kwargs):
        content = data
        kwargs['content_type'] = 'application/json'
        super(JSONResponse, self).__init__(content, **kwargs)


from sqlalchemy.ext.declarative import DeclarativeMeta


class AlchemyEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime.datetime):
            return obj.strftime(datetime_format)
        if isinstance(obj.__class__, DeclarativeMeta):
            # return json.dumps({c.name: getattr(obj, c.name, None) for c in obj.__table__.columns})
            # an SQLAlchemy class
            fields = {}
            for field in [x for x in dir(obj) if not x.startswith('_') and x != 'metadata']:
                data = obj.__getattribute__(field)
                try:
                    json.dumps(data, default=serialize)  # this will fail on non-encodable values, like other classes
                    fields[field] = data
                except TypeError:
                    fields[field] = None
            # a json-encodable dict
            return fields
        return json.JSONEncoder.default(self, obj)


def serialize(obj):
    if isinstance(obj, ObjectId):
        return str(obj)
    if isinstance(obj, datetime.datetime):
        return obj.strftime("%Y-%m-%d")
    return json.dumps(obj)


def jsonfy(obj):
    """
    将对象序列化为JSON
    :param obj:
    :return: None
    """
    return json.dumps(obj, cls=AlchemyEncoder)
