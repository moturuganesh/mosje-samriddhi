from fastapi.testclient import TestClient
from app.main import app
from app.core.router import haversine_distance_km

client = TestClient(app)

def test_haversine():
    d = haversine_distance_km(12.7930, 80.2180, 13.0827, 80.2707)
    assert 30.0 < d < 40.0, f'Expected distance ~32-35 km, got {d}'

def test_route_branch_endpoint():
    res = client.post('/api/branches/route', json={
        'user_lat': 12.7930,
        'user_lng': 80.2180,
        'loan_amount': 100000.0,
        'district': 'Chengalpattu',
        'state': 'Tamil Nadu'
    })
    assert res.status_code == 200, f'Expected 200, got {res.status_code}'
    data = res.json()
    assert 'recommended_branch' in data
    assert 'alternative_branches' in data
    assert 'bypassed_branches' in data
    if data['recommended_branch']:
        assert data['recommended_branch']['npa_rate'] <= 10.0

def test_admin_branches_endpoint():
    res = client.get('/api/admin/branches')
    assert res.status_code == 200
    data = res.json()
    assert 'branches' in data
    assert len(data['branches']) > 0
