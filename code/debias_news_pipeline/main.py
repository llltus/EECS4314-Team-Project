# Instructions on how to get API KEY and URL for the watson tone analyzer can be found here: https://cloud.ibm.com/docs/tone-analyzer?topic=tone-analyzer-gettingStarted#prerequisites
# The NYTIMES API key can be obtained by creating an account here: https://developer.nytimes.com/docs/articlesearch-product/1/overview
from newspaper import Article
import requests
import json
import requests
from helpers.NYTimesHelper import get_nytimes_urls
from helpers.ToneAnalyzerHelper import getTone

def main():
    ny_times_urls = get_nytimes_urls()
    documents = create_document(ny_times_urls)

    for document in documents:
        post_document(document)
    with open('title_abstract_apis.json', 'w') as f:
        json.dump(documents, f)



def create_document(article_meta_array):
    documents = []
    for article_meta in article_meta_array:
        article_text = parse_article(article_meta['url'])
        tone = getTone(article_text.text)
        processed_tone_response = process_article_meta(article_meta, tone)
        documents.append(processed_tone_response)
    return documents


def post_document(document):
    url = 'http://3.85.125.119:5050/articles/insert'
    y = requests.post(url, json=document)
    return y.status_code

def process_article_meta(article_meta, tones):
    article_data = dict()
    article_data['source'] = article_meta['source']
    article_data['authors'] = article_meta['authors']
    article_data['title'] = article_meta['title']
    article_data['abstract'] = article_meta['abstract']
    article_data['url'] = article_meta['url']
    article_data['keywords'] = article_meta['keywords']
    article_data['published_date'] = article_meta['published_date']

    article_tones = tones["document_tone"]["tones"]
    article_data["tones"] = dict()
    for tone in article_tones:
        article_data["tones"][tone["tone_id"]] = tone["score"]
    return article_data

def parse_article(article_url):
    article = Article(article_url)
    article.download()
    article.parse()
    print(article.text)
    return article


if __name__ == "__main__":
    main()

