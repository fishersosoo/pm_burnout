# coding=utf-8
import datetime

from bson import ObjectId
from flask_principal import identity_loaded, identity_changed, Identity, AnonymousIdentity
from sqlalchemy import and_
from sqlalchemy.orm.exc import MultipleResultsFound, NoResultFound
from flask import redirect, request, flash, url_for, render_template, current_app, session, json
import hashlib
from base.forms import LoginForm
from user.forms import NewUserForm
from user.models import User
from base import base
from flask_login import login_user, current_user, login_required, logout_user
import bcrypt
from pm_burndown import app, login_manager, mongo


@identity_loaded.connect_via(app)
def on_identity_loaded(sender, identity):
    """
    从用户中读取用户角色

    :param sender:
    :param identity:
    :return:
    """
    identity.user = current_user
    pass


@login_manager.user_loader
def load_user(id_):
    """
     flask-login的回调函数，从每次请求的session中读取用户id
    调用此函数根据id查询数据库返回用户对象，找不到时候要返回None

    :param id_:
    :return:
    """
    user = None
    try:
        user = mongo.db.user.find_one({"username": id_})
        if user is None:
            raise NoResultFound()
        user = User(user["username"])
    except MultipleResultsFound as e:
        # TODO: deal with MultipleResultsFound
        pass
    finally:
        return user


@base.route('login/', methods=['GET', 'POST'])
def login():
    if not current_user.is_anonymous:
        return redirect(request.args.get("next") or url_for(".index", _external=True))
    form = LoginForm()
    if form.validate_on_submit():
        username = form.username.data
        password = form.password.data
        user = None
        try:

            user = mongo.db.user.find_one({"username": username})
        except MultipleResultsFound as e:
            # TODO: deal with MultipleResultsFound
            pass
        # password_match = bcrypt.checkpw(password.encode(), user.password.encode())
        if user is None:
            flash(u"帐号或密码出错", category="danger")
            return render_template("base/login.html", form=form)
        user = User(user["username"])
        login_user(user, form.remember_me.data)
        identity_changed.send(current_app._get_current_object(), identity=Identity(user.username))
        return redirect(request.args.get("next") or url_for(".index", _external=True))
    return render_template("base/login.html", form=form)


@base.route('', methods=['GET'])
@login_required
def index():
    user_form = NewUserForm()
    return render_template('base/index.html', new_user_form=user_form)


@base.route("logout/")
@login_required
def logout():
    """
    注销帐号，清除session
    重定向到登录页面
    :return:
    """
    logout_user()
    for key in ('identity.name', 'identity.auth_type'):
        session.pop(key, None)
    identity_changed.send(current_app._get_current_object(),
                          identity=AnonymousIdentity())
    return redirect(url_for(".login"))


@base.route("project/", methods=['GET'])
def project_sprint_page():
    """项目中冲刺页面"""
    user_form = NewUserForm()
    return render_template('base/project_sprint.html', new_user_form=user_form)


@base.route("sprint/", methods=['GET'])
def sprint_task_page():
    """
    冲刺任务页面

    :return:
    """
    user_form = NewUserForm()
    return render_template('base/sprint_task.html', new_user_form=user_form)


@base.route("projects/", methods=['GET'])
def projects():
    """
    项目列表

    :return:
    """

    return json.jsonify([one for one in mongo.db.project.find()])


@base.route("sprints/", methods=['GET'])
def sprints():
    """
    冲刺列表

    :return:
    """
    project_id = request.args.get("id")
    return json.jsonify([one for one in mongo.db.sprint.find({"belong_project": project_id})])


@base.route("tasks/", methods=['GET'])
def tasks():
    """
    任务列表

    :return:
    """
    sprint_id = request.args.get("sprint_id")
    person = current_user.username
    if person != "user_0":
        tasks = [one for one in mongo.db.task.find({"person": person, "sprint_id": ObjectId(sprint_id)})]
    else:
        tasks = [one for one in mongo.db.task.find({"sprint_id": ObjectId(sprint_id)})]
    for task in tasks:
        if task["done"]:
            task["remain_hour"] = 0
        else:
            task["remain_hour"] = task["hour"]
            for one in mongo.db.work_time.find({"task_id": task["_id"]}):
                task["remain_hour"] -= int(one["worked_hour"])
            if task["remain_hour"] == 0:
                task["done"] = True
    return json.jsonify(tasks)


@base.route("commit_hour/", methods=['POST'])
def change_task():
    """
    修改任务状态

    :return:
    """

    sprint_id = request.form["sprint_id"]
    task_id = request.form["task_id"]
    hours = request.form["hours"]
    mongo.db.work_time.insert_one(
        {"sprint_id": ObjectId(sprint_id), "task_id": ObjectId(task_id), "worked_hour": int(hours),
         "submit_data": datetime.datetime.now()})
    return json.jsonify([one for one in mongo.db.project.find()])
