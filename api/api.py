import datetime
from flask import Flask, request, render_template_string, abort
import datetime
import sys

import config
import utils
import db

app = Flask(__name__)
app.config["MONGO_URI"] = config.MONGO_URI

try:
    db.set_db(app)
except RuntimeError as e:
    print("Failed to set up database") 
    sys.exit(127)

@app.route("/time")
def get_time():
    return {"time": datetime.datetime.now()}

@app.route("/us/<stateAbbrv>")
def get_by_state(stateAbbrv, methods=["GET"]):
    if request.method == "GET":
        date = utils.get_date_from_args()
        res = db.get_by_state_and_date(stateAbbrv, date) 
        return res
    else:
        abort(405)


@app.route("/world/<countryCode>", methods=["GET"])
def get_by_country(countryCode):
    if request.method == "GET":
        date = utils.get_date_from_args()
        res = db.get_by_country_and_date(countryCode, date)
        return res
    else:
        abort(405)


@app.errorhandler(405)
def wrong_request(error):
    return render_template_string(
            "{} request is not valid".format(request.method)), 405

