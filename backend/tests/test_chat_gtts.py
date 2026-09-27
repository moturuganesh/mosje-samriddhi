import base64
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_state_aware_branch_routing_query():
    app_state = {
        'applicant_name': 'Priyadarshini M',
        'annual_family_income': 180000,
        'gender': 'F',
        'category': 'SC',
        'project_cost': 100000,
        'scheme_name': 'Mahila Samriddhi Yojana (MSY)',
        'interest_rate_pct': 4.0,
        'loan_amount': 90000,
        'recommended_branch': {
            'branch_id': 'PSB-IB-KLV-02',
            'name': 'Indian Bank - Kalavakkam SME Specialized Branch',
            'distance_km': 0.0,
            'npa_percentage': 1.8
        },
        'emiResult': {
            'moratorium_months': 3,
            'monthly_emi_post_moratorium': 3221.0
        }
    }

    # Ask in English: Where should I go to get my loan?
    res = client.post('/api/chat', json={
        'message': 'Where should I go to get my loan?',
        'language': 'en',
        'history': [],
        'app_state': app_state
    })
    assert res.status_code == 200, f'Expected 200, got {res.status_code}'
    data = res.json()
    assert 'reply_text' in data
    assert 'audio_base64' in data
    
    reply = data['reply_text']
    assert 'Kalavakkam' in reply or 'Indian Bank' in reply or 'currently assisting' in reply, f'Expected branch name in reply, got: {reply}'
    print('State-Aware English Reply:', reply)

    # Validate audio base64
    assert len(data['audio_base64']) > 500
    audio_bytes = base64.b64decode(data['audio_base64'])
    assert len(audio_bytes) > 500
    print('Audio Base64 Decoded Length:', len(audio_bytes), 'bytes')
    print('PASS: test_state_aware_branch_routing_query')

def test_tamil_gtts_state_aware():
    app_state = {
        'applicant_name': 'Priyadarshini M',
        'scheme_name': 'Mahila Samriddhi Yojana (MSY)',
        'interest_rate_pct': 4.0,
        'loan_amount': 90000,
        'recommended_branch': {
            'name': 'Indian Bank - Kalavakkam SME Specialized Branch',
            'distance_km': 0.0
        },
        'emiResult': {
            'moratorium_months': 3,
            'monthly_emi_post_moratorium': 3221.0
        }
    }
    res = client.post('/api/chat', json={
        'message': 'எனது கடன் பெற நான் எந்த வங்கி கிளைக்கு செல்ல வேண்டும்?',
        'language': 'ta',
        'history': [],
        'app_state': app_state
    })
    assert res.status_code == 200
    data = res.json()
    assert 'reply_text' in data
    assert 'audio_base64' in data
    assert len(data['audio_base64']) > 500
    print('Tamil Reply generated & gTTS audio encoded successfully')
    print('PASS: test_tamil_gtts_state_aware')

def test_hindi_gtts_state_aware():
    app_state = {
        'applicant_name': 'Priyadarshini M',
        'scheme_name': 'Mahila Samriddhi Yojana (MSY)',
        'interest_rate_pct': 4.0,
        'loan_amount': 90000,
        'recommended_branch': {
            'name': 'Indian Bank - Kalavakkam SME Specialized Branch',
            'distance_km': 0.0
        },
        'emiResult': {
            'moratorium_months': 3,
            'monthly_emi_post_moratorium': 3221.0
        }
    }
    res = client.post('/api/chat', json={
        'message': 'मुझे अपना लोन लेने कहाँ जाना होगा?',
        'language': 'hi',
        'history': [],
        'app_state': app_state
    })
    assert res.status_code == 200
    data = res.json()
    assert 'reply_text' in data
    assert 'audio_base64' in data
    assert len(data['audio_base64']) > 500
    print('Hindi Reply generated & gTTS audio encoded successfully')
    print('PASS: test_hindi_gtts_state_aware')

if __name__ == '__main__':
    test_state_aware_branch_routing_query()
    test_tamil_gtts_state_aware()
    test_hindi_gtts_state_aware()
    print('ALL STATE-AWARE GTTS TESTS PASSED SUCCESSFULLY!')
