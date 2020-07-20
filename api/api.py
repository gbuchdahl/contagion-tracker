import time
from flask import Flask
from flask_pymongon import Pymongo

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb+srv://root:contagion@data.ybs5g.mongodb.net/data?retryWrites=true&w=majority"
mongo = Pymongo(app)

@app.route("/time")
def get_current_time():
    return {"time": time.time()}

@app.route("/get_by_state")
def get_by_state():
    return {}

@app.route("/get_by_country")
def get_by_country():
    return {}
