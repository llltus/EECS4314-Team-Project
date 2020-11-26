
import re
import json
from flask import Flask, jsonify, request
import pymongo
from pymongo import MongoClient
from flask_cors import CORS, cross_origin
import logging
from logging.handlers import RotatingFileHandler
import time
import os
import traceback


os.environ['TZ'] = 'America/Toronto'
time.tzset()

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

def get_db():
    client = MongoClient(host='debias_db',
                         port=27017,
                         username='root',
                         password='pass',
                         authSource="admin")
    db = client["article_db"]
    return db

def get_articles():
    db = get_db()
    _articles = db.article_tb.find()
    articles = [{"source": article["source"], "authors": article["authors"], "title": article["title"], "abstract": article["abstract"], "keywords": article["keywords"],
                 "url": article["url"], "published_date": article["published_date"], "tones": article["tones"]} for article in _articles]
    return articles

@app.route('/')
def ping_server():
    return "Welcome to the world of articles."


@app.route('/articles')
def get_stored_articles():
    return jsonify({"articles": get_articles()})


@app.route('/articles/<tone>')
def get_stored_articles_by_tone(tone):
    articles = [article for article in get_articles(
    ) for actual_tone, _ in article["tones"].items() if tone == actual_tone]
    return jsonify({"articles": articles})

@app.route('/articles/insert', methods=['POST'])
def insert_article():
    db = get_db()
    article = request.get_json()
    try:
        db.article_tb.insert_one(article).inserted_id
        return ('', 204)
    except:
        return ('Duplicate article', 500)

def insert_log(timestamp, level, ip, method, path, message, trace, failure):
    db = get_db()
    log = {"timestamp" : timestamp, "level" : level, "ip" : ip, "method" : method, "path" : path, "message" : message, "trace" : trace, "failure" : failure}
    db.log_tb.insert_one(log)
    return ('', 204)

@app.route('/logs')
def get_logs():
    db = get_db()
    _logs = db.log_tb.find()
    logs = [{"timestamp": log["timestamp"], "level": log["level"], "ip": log["ip"], "method": log["method"], "path": log["path"], "message": log["message"], "trace" : log["trace"], "failure" : log["failure"]} for log in _logs]
    return jsonify(logs)

@app.errorhandler(404)
def page_not_found(e):
    app.logger.error('404, page not found, make sure the url is correct!')
    return '404, page not found'

@app.route('/arithexception')
def arithexception():
    try:
        1 / 0
    except ZeroDivisionError:
        app.logger.error('Zero division exception')
    finally:
        return 'Zero division exception'

@app.route('/timeout')
def timeout():
    time.sleep(2)
    app.logger.error('Timeout, server takes too long time to response, please retry!')
    return 'Timeout'

def analyze(message):
    if '404' in message:
        return 404
    elif 'timeout' in message.lower():
        return 'timeout'
    elif 'zero division' in message.lower():
        return 'zero division exception'

class logHandler(logging.Handler):
    def emit(self, record):
        trace = None
        exc = record.__dict__['exc_info']
        if exc:
            trace = traceback.format_exc(exc)

        timestamp = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime())
        path = request.path
        method = request.method
        ip = request.remote_addr
        level=record.__dict__['levelname']
        message=record.__dict__['msg']
        trace=trace
       
        insert_log(timestamp, level, ip, method, path, message, trace, analyze(message))
    
if __name__ == '__main__':
    handler = logHandler()
    handler.setLevel(logging.DEBUG)
    app.logger.addHandler(handler)
    app.run(host="0.0.0.0", port=5050)