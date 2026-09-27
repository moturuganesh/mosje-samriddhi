import sys
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def safe_print(label, text):
    try:
        print(f"{label} {text}")
    except UnicodeEncodeError:
        print(f"{label} {text.encode('ascii', 'replace').decode('ascii')}")

def test_chat_english():
    payload = {
        'message': 'What is a moratorium period and how does it help me?',
        'language': 'en-IN',
        'history': [],
        'user_context': {
            'applicant_name': 'Priyadarshini',
            'scheme_name': 'Mahila Samriddhi Yojana (MSY)',
            'interest_rate_pct': 4.0,
            'moratorium_months': 3
        }
    }
    res = client.post('/api/chat', json=payload)
    assert res.status_code == 200, f'Expected 200, got {res.status_code}'
    data = res.json()
    assert 'reply_text' in data
    assert len(data['reply_text']) > 10
    safe_print('English Chat Response:', data['reply_text'])
    print('PASS: test_chat_english')

def test_chat_tamil():
    payload = {
        'message': 'மொரட்டோரியம் என்றால் என்ன? எனக்கு என்ன நன்மை?',
        'language': 'ta-IN',
        'history': [
            {'role': 'user', 'text': 'வணக்கம், எனக்கு கடன் கிடைக்குமா?'},
            {'role': 'model', 'text': 'வணக்கம் பிரியதர்ஷினி! உங்களுக்கு மகளிர் சம்ரிதி யோஜனா கீழ் கடன் கிடைக்கும்.'}
        ],
        'user_context': {
            'applicant_name': 'Priyadarshini',
            'scheme_name': 'Mahila Samriddhi Yojana (MSY)',
            'interest_rate_pct': 4.0,
            'moratorium_months': 3
        }
    }
    res = client.post('/api/chat', json=payload)
    assert res.status_code == 200, f'Expected 200, got {res.status_code}'
    data = res.json()
    assert 'reply_text' in data
    assert len(data['reply_text']) > 10
    safe_print('Tamil Chat Response:', data['reply_text'])
    print('PASS: test_chat_tamil')

def test_chat_hindi():
    payload = {
        'message': 'मोरेटोरियम क्या है? क्या मुझे तुरंत किस्त देनी होगी?',
        'language': 'hi-IN',
        'history': [],
        'user_context': {
            'applicant_name': 'Priyadarshini',
            'scheme_name': 'Mahila Samriddhi Yojana (MSY)',
            'interest_rate_pct': 4.0,
            'moratorium_months': 3
        }
    }
    res = client.post('/api/chat', json=payload)
    assert res.status_code == 200, f'Expected 200, got {res.status_code}'
    data = res.json()
    assert 'reply_text' in data
    assert len(data['reply_text']) > 10
    safe_print('Hindi Chat Response:', data['reply_text'])
    print('PASS: test_chat_hindi')

if __name__ == '__main__':
    test_chat_english()
    test_chat_tamil()
    test_chat_hindi()
    print('ALL CHAT TESTS PASSED SUCCESSFULLY!')
