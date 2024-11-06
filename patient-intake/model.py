from loguru import logger
from dotenv import load_dotenv
from pymongo import MongoClient

import sys
import os
load_dotenv(override=True)

logger.remove(0)
logger.add(sys.stderr, level="DEBUG")

MONGOURI = os.getenv('MONGO_URI')
client = MongoClient(MONGOURI)
db = client.riva_python_backend

class ErrorLogs:
    def __init__(self, user_id, error_msg, function_name, created_at, updated_at):
        self.user_id = user_id
        self.error_msg = error_msg
        self.function_name = function_name
        self.created_at = created_at
        self.updated_at = updated_at

    def save(self):
        db.errorLogs.insert_one(self.__dict__)

    @staticmethod
    def find_all(user_id):
        error_logs = db.errorLogs.find({"user_id": user_id}).sort('_id', -1)
        error_logs_list = [error_log for error_log in error_logs]
        for error_log in error_logs_list:
            error_log['_id'] = str(error_log['_id'])
        return error_logs_list
