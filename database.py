# # coding=utf-8
# from sqlalchemy import create_engine
# from sqlalchemy.orm import scoped_session, sessionmaker
# from sqlalchemy.ext.declarative import declarative_base
# import pymysql
# from config import mysql_config
#
# engine = create_engine("mysql+pymysql://{username}:{password}@{host}:{port}/{db}"
#                        .format(**mysql_config))
# db_session=scoped_session(sessionmaker(autocommit=False,
#                                        autoflush=False,
#                                        bind=engine))
# BaseModel=declarative_base()
# BaseModel.query=db_session.query_property()
