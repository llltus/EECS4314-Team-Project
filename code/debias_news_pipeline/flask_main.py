from flask import Flask
from helpers.CollectArticles import runNYTimes
app = Flask(__name__)

@app.route('/run-nyt')
def getNYTimesArticles():
    runNYTimes()
