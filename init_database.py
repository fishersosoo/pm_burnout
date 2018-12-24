# coding=utf-8
import datetime
import random

from pm_burndown import mongo


def init_project():
    """初始化项目表"""
    mongo.db.project.insert_one(
        dict(name="project_1", owner="user_0", start_time=datetime.datetime.strptime("2018-12-1", "%Y-%m-%d"),
             end_time=datetime.datetime.strptime("2019-2-1", "%Y-%m-%d"), people=[f"user_{i}" for i in range(10)])
    )


def init_sprint():
    sprint_id = mongo.db.sprint.insert_one(
        dict(belong_project="project_1", sprint_name="冲刺1",
             start_time=datetime.datetime.strptime("2018-12-1", "%Y-%m-%d"),
             end_time=datetime.datetime.strptime("2018-1-1", "%Y-%m-%d"))
    ).inserted_id
    people = [f"user_{i}" for i in range(10)]
    for person in people:
        for one_task in range(20):
            mongo.db.task.insert_one(dict(
                sprint_id=sprint_id,
                person=person,
                task_name=f"task_{one_task}_for_{person}",
                content=f"finish {one_task} for {person}",
                hour=random.randint(1,20)
            ))


def init_user():
    """初始化用户表"""
    for i in range(10):
        mongo.db.user.insert_one({"username": f"user_{i}", "latest": True})


if __name__ == '__main__':
    init_project()
    init_user()
