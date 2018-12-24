# coding=utf-8
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField, SubmitField, Field, HiddenField
from wtforms.validators import DataRequired, Length, Email


class NewUserForm(FlaskForm):
    """
    登录表单
    """
    username = StringField(validators=[DataRequired(), Length(min=1, max=25)])
    showname = StringField(validators=[DataRequired(), Length(min=1, max=100)])
    password = PasswordField(validators=[DataRequired()])
    question = StringField(validators=[Length(max=255)])
    answer = StringField(validators=[Length(max=255)])
    description = StringField(validators=[Length(max=255)])
    email = StringField(validators=[Length(max=255), Email()])
    default_url = StringField(validators=[Length(max=255)])
    enabled = BooleanField()
    submit = SubmitField()

    def __init__(self, **kwargs):
        super(self.__class__, self).__init__(**kwargs)
        self.fields = []
        for name, value in self.__dict__.items():
            if isinstance(value, Field) and not isinstance(value, HiddenField) and not isinstance(value, SubmitField):
                self.fields.append(value)
