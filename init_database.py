# coding=utf-8
import datetime
import random

from bson import ObjectId

from pm_burndown import mongo


def init_project():
    """初始化项目表"""
    mongo.db.project.insert_one(
        dict(name="project_1", owner="user_0", start_time=datetime.datetime.strptime("2018-12-1", "%Y-%m-%d"),
             end_time=datetime.datetime.strptime("2019-2-1", "%Y-%m-%d"), people=[f"user_{i}" for i in range(10)])
    )


def init_sprint():
    sprint_id = mongo.db.sprint.insert_one(
        dict(belong_project="5c20d32db891425d78a32a06", sprint_name="冲刺1",
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
                hour=random.randint(1, 20),
                done=False
            ))


def init_work_time(sprint_id):
    # 12.1 ~ 1.1  24日.
    # 0.7 task done; 0.2 doing; 0.1 完全没做
    task_data = list(mongo.db.task.find())
    random.shuffle(task_data)
    task_num = len(task_data)
    done_num = task_num * 0.7
    doing_num = task_num * 0.2
    # none_num = task_num * 0.1

    for i in range(task_num):
        task_id = task_data[i]['_id']
        sprint_id = task_data[i]['sprint_id']
        all_time = task_data[i]['hour']
        if done_num < i < done_num + doing_num:  # 做了一半的
            all_time = int(all_time / 2)
        elif i > done_num + doing_num:
            break
        if all_time <= 0:
            break
        work_time_datas = []
        split_num = (all_time - 1) // 5 + 1
        days = random.randint(split_num, int(2.5 * split_num))
        day_start = random.randint(1, 24 - days)
        num = 0
        while all_time > 0 and days > 0:
            work_hour = random.randint(1, min(all_time, 8))
            if days == 1:  # 只剩最后一天
                work_hour = all_time  # 做完

            work_time_datas.append({'task_id': task_id,
                                    'sprint_id': sprint_id,
                                    'submit_data': datetime.datetime(2018, 12, day_start + num),
                                    'worked_hour': work_hour})

            all_time -= work_hour
            days -= 1
            num += 1
        mongo.db.work_time.insert_many(work_time_datas)


def init_user():
    """初始化用户表"""

    for i in range(10):
        mongo.db.user.insert_one({"username": f"user_{i}", "latest": True})


def update_task():
    """根据worktime表，更新task任务列表中done的状态"""
    task_data = mongo.db.task.find()
    for task in task_data:
        task_id = task['_id']
        sprint_id = task['sprint_id']
        # mongo.db.task.update(
        #     {'_id': task_id, 'sprint_id': sprint_id},
        #     {'$set': {'done': False}})
        all_time = task['hour']
        work_time_datas = mongo.db.work_time.find({'task_id': task_id, 'sprint_id': sprint_id})
        work_hour_sum = 0
        for work_time in work_time_datas:
            work_hour_sum += work_time['worked_hour']
        assert work_hour_sum <= all_time
        if work_hour_sum == all_time:
            mongo.db.task.update(
                {'_id': task_id, 'sprint_id':sprint_id},
                {'$set': {'done': True}})


if __name__ == '__main__':
    # init_work_time(1)
    # init_project()
    # init_user()
    update_task()