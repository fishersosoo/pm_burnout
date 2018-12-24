# coding=utf-8
import os

from bson import ObjectId
from flask.json import JSONEncoder

from core.json_response import AlchemyEncoder


class CustomJSONEncoder(JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return JSONEncoder.default(self, o)


mysql_config = {
    "host": "111.230.17.80",
    "port": 3306,
    "username": "root",
    "password": "Ss673725907_",
    "db": "iur",
}
SQLALCHEMY_DATABASE_URI = "mysql+pymysql://{username}:{password}@{host}:{port}/{db}".format(**mysql_config)

SQLALCHEMY_TRACK_MODIFICATIONS = False
RESTFUL_JSON = {'cls': CustomJSONEncoder}
MONGO_URI = "mongodb://ns.fishersosoo.xyz:80/pm_burnchart"
