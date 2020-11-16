from ibm_watson import ToneAnalyzerV3
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator
import os

tone_analyzer_api_key = os.environ.get('TONE_ANALYZER_API_KEY')
tone_analyzer_url = os.environ.get('TONE_ANALYZER_URL')

# gets the tone from the watson tone analy
def getTone(text):
    """Gets the tone analyzer response from the given text.

    Args:
        apikey (str): api key for the watson tone analyzer instance 
        url (str): url for the instance of the watson tone analyzer
        text (str): the text to be proceced by the tone analyzer

    Returns:
        str: returns a json formatted response from the tone analyzer

    """

    authenticator = IAMAuthenticator(tone_analyzer_api_key)
    tone_analyzer = ToneAnalyzerV3(
        version='2017-09-21',
        authenticator=authenticator
    )
    tone_analyzer.set_service_url(tone_analyzer_url)
    tone_analysis = tone_analyzer.tone(
        {'text': text},
        content_type='application/json'
    ).get_result()
    return tone_analysis