import datetime
from flask import request

DOCUMENT_NOT_FOUND = {"error": "Document not found"}

def get_date_from_args():
    date = request.args.get("date", default=None)
    if date is None:
        date = datetime.date.today()
    else:
        date = datetime.datetime.strptime(date, "%d_%m_%Y")
        date.replace(minute=0, hour=0)
    return date.replace(tzinfo=datetime.timezone.utc)
