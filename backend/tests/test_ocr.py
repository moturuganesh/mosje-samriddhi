import io
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_mock_document_extraction():
    # Create a dummy image byte stream
    dummy_image_data = b'fake_image_bytes_for_testing'
    files = {'file': ('certificate.jpg', dummy_image_data, 'image/jpeg')}
    
    response = client.post('/api/mock/extract-document', files=files)
    assert response.status_code == 200, f'Expected 200 but got {response.status_code}'
    
    data = response.json()
    print('Mock OCR Response Data:', data)
    
    # Assert structured schema fields
    assert 'applicant_name' in data and data['applicant_name'] == 'Priyadarshini'
    assert 'annual_income' in data and isinstance(data['annual_income'], int)
    assert data['annual_income'] == 90000
    assert 'gender' in data and data['gender'] in ('M', 'F', 'Other', 'Female', 'Male')
    assert 'category' in data and data['category'] == 'SC'
    assert 'certificate_id' in data and data['certificate_id'] == 'TN/CGL/2026/INC-98231'
    assert 'state' in data and data['state'] == 'Tamil Nadu'
    assert 'district' in data and data['district'] == 'Chengalpattu'
    print('PASS: test_mock_document_extraction')

def test_extract_document_endpoint():
    dummy_image_data = b'sample_caste_certificate_stream'
    files = {'file': ('caste_certificate.png', dummy_image_data, 'image/png')}
    
    response = client.post('/api/extract-document', files=files)
    assert response.status_code == 200, f'Expected 200 but got {response.status_code}'
    
    data = response.json()
    assert 'applicant_name' in data
    assert 'annual_income' in data
    assert isinstance(data['annual_income'], int)
    print('PASS: test_extract_document_endpoint')

if __name__ == '__main__':
    test_mock_document_extraction()
    test_extract_document_endpoint()
    print('ALL OCR TESTS PASSED SUCCESSFULLY!')
