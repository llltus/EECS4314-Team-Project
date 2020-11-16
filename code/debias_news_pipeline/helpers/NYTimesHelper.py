# The NYTIMES API key can be obtained by creating an account here: https://developer.nytimes.com/docs/articlesearch-product/1/overview
import requests
import json
import os

most_viewed_url = 'https://api.nytimes.com/svc/mostpopular/v2/viewed/1.json'
most_shared_on_facebook_url = 'https://api.nytimes.com/svc/mostpopular/v2/shared/1/facebook.json'
most_emailed = 'https://api.nytimes.com/svc/mostpopular/v2/emailed/7.json'

nytimes_api_key = os.environ.get('NY_TIMES_API_KEY')

def get_nytimes_urls():
    article_meta = dict()
    for url in [most_viewed_url, most_shared_on_facebook_url, most_emailed]:
        res = getArticleMeta(url)
        articles = processArticleMeta(res)
        for article in articles:
            if article['url'] not in article_meta:
                article_meta[article['url']] = article

    return list(article_meta.values())

def getArticleMeta(url):
    params = dict()
    params["api-key"] = nytimes_api_key
    response = requests.get(url, params=params)

    if response.status_code != 200:
        raise ValueError(f'Request failed - status: {response.status_code}')
    return response.json()

def processArticleMeta(response):
    articles = []
    for result in response['results']:
        article = dict()
        article['keywords'] = result['adx_keywords'].split(';')
        article['published_date'] = result['published_date']
        article['source'] = result['source']
        article['authors'] = result['byline'][3:]
        article['url'] = result['url']
        article['title'] = result['title']
        article['abstract'] = result['abstract']

        articles.append(article)
    return articles