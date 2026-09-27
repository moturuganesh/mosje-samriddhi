from fastapi.testclient import TestClient
from app.main import app
from app.core.router import haversine_distance_km

client = TestClient(app)

def test_haversine():
    # Distance between Kalavakkam (12.7930, 80.2180) and TAHDCO Chennai HQ (13.0827, 80.2707)
    d = haversine_distance_km(12.7930, 80.2180, 13.0827, 80.2707)
    assert 30.0 < d < 40.0, f'Expected distance ~32-35 km, got {d}'
    print('PASS: test_haversine')

def test_route_branch_kalavakkam_applicant_and_bypass():
    # Applicant in Kalavakkam, Chengalpattu, Tamil Nadu
    res = client.post('/api/route-branch', json={
        'user_lat': 12.7930,
        'user_lon': 80.2180,
        'loan_amount': 100000.0,
        'district': 'Chengalpattu'
    })
    assert res.status_code == 200, f'Expected 200, got {res.status_code}'
    data = res.json()
    
    rec = data['recommended_branch']
    assert rec is not None
    print('Top Recommended Branch:', rec['name'], 'NPA:', rec['npa_percentage'], '% Distance:', rec['distance_km'], 'km Score:', rec['final_score'])
    
    # Must route to healthy branch (Indian Bank Kalavakkam or TAHDCO)
    assert rec['branch_id'] in ('PSB-IB-KLV-001', 'SCA-TN-CHN-01', 'SCA-TN-CGL-17')
    assert rec['npa_percentage'] <= 2.5
    assert rec['status'] == 'ACTIVE'
    
    # Must explicitly bypass distressed Tamil Nadu Grama Bank in Chengalpattu (13.5% NPA)
    bypassed_ids = [b['branch_id'] for b in data['bypassed_branches']]
    assert 'RRB-TNGB-CGL-03' in bypassed_ids, 'Expected distressed TNGB Chengalpattu (13.5% NPA) to be bypassed'
    
    print('Bypassed Distressed Branches Count:', len(data['bypassed_branches']))
    for b in data['bypassed_branches']:
        print(' -', b['name'], ':', b['bypass_reason'])
    print('PASS: test_route_branch_kalavakkam_applicant_and_bypass')

def test_admin_branches_endpoint():
    res = client.get('/api/admin/branches')
    assert res.status_code == 200
    data = res.json()
    assert data['total_branches'] >= 15
    assert data['active_branches'] > 0
    assert data['blocked_branches'] > 0
    assert data['total_funds_available_lakhs'] > 500.0
    print('Admin Overview: Total Branches:', data['total_branches'], 'Total Funds: Rs', data['total_funds_available_lakhs'], 'Lakhs Avg NPA:', data['average_npa_percentage'], '%')
    print('PASS: test_admin_branches_endpoint')

if __name__ == '__main__':
    test_haversine()
    test_route_branch_kalavakkam_applicant_and_bypass()
    test_admin_branches_endpoint()
    print('ALL TAMIL NADU ROUTER TESTS PASSED SUCCESSFULLY!')
