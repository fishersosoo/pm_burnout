# coding=utf-8
"""process user views"""
from flask import Blueprint

user = Blueprint("user", __name__)

from . import views
