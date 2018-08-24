#!app/__init__.py

from flask import Flask

from .v1.views.auth import auth
from .v1.views.questions import questions

app = Flask(__name__)
app.url_map.strict_slashes = False
app.register_blueprint(auth)
app.register_blueprint(questions)
