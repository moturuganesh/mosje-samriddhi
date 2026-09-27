import os
import base64
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_missing_api_key_returns_http_500():
    # Temporarily unset GEMINI_API_KEY
    old_key = os.environ.get('GEMINI_API_KEY')
    os.environ['GEMINI_API_KEY'] = 'placeholder'
    try:
        res = client.post('/api/chat', json={
            'message': 'Where should I go to get my loan?',
            'language': 'en',
            'history': [],
            'app_state': {}
        })
        assert res.status_code == 500, f'Expected HTTP 500 when API key is missing, got {res.status_code}'
        detail = res.json().get('detail', '')
        assert 'GEMINI_API_KEY is not configured' in detail
        print('PASS: test_missing_api_key_returns_http_500 - Detail:', detail)
    finally:
        if old_key:
            os.environ['GEMINI_API_KEY'] = old_key

def test_empty_message_returns_http_400():
    res = client.post('/api/chat', json={
        'message': '',
        'language': 'en',
        'history': [],
        'app_state': {}
    })
    assert res.status_code == 400
    print('PASS: test_empty_message_returns_http_400')

if __name__ == '__main__':
    test_missing_api_key_returns_http_500()
    test_empty_message_returns_http_400()
    print('ALL STRICT BACKEND CHAT TESTS PASSED!')
