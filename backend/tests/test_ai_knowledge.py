import os
import base64
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_ai_website_knowledge():
    res = client.post('/api/chat', json={
        'message': 'How does this website help me?',
        'language': 'en',
        'history': [],
        'app_state': {
            'applicant_name': 'Test User'
        }
    })
    assert res.status_code == 200
    data = res.json()
    reply = data['reply_text']
    print("AI Knowledge Reply:", reply)
    # Check if it mentions some of the platform knowledge (OCR, 4 steps, routing, etc.)
    assert 'samriddhi' in reply.lower(), "AI didn't provide a conversational helpful response."
    print("PASS: test_ai_website_knowledge")

if __name__ == '__main__':
    test_ai_website_knowledge()
