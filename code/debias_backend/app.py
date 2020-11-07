
import re
import json
from flask import Flask, jsonify, request
import pymongo
from pymongo import MongoClient
from flask_cors import CORS, cross_origin

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


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5050)