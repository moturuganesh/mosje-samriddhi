import json
import os

branches = [
    # Tamil Nadu
    {"id": "TN-SCA-001", "name": "TAHDCO Head Office", "type": "SCA", "state": "Tamil Nadu", "district": "Chennai", "latitude": 13.0827, "longitude": 80.2707, "npa_rate": 4.5, "fund_utilization_pct": 75.0, "contact_officer": "R. Ramesh (Desk: 044-243290)"},
    {"id": "TN-PSB-001", "name": "Indian Bank Main Branch", "type": "PSB", "state": "Tamil Nadu", "district": "Coimbatore", "latitude": 11.0168, "longitude": 76.9558, "npa_rate": 2.3, "fund_utilization_pct": 82.5, "contact_officer": "S. Meenakshi (Desk: 0422-230981)"},
    {"id": "TN-RRB-001", "name": "Tamil Nadu Grama Bank", "type": "RRB", "state": "Tamil Nadu", "district": "Chengalpattu", "latitude": 12.6920, "longitude": 79.9850, "npa_rate": 11.2, "fund_utilization_pct": 90.0, "contact_officer": "K. Karthik (Desk: 044-274291)"}, # High NPA
    
    # Uttar Pradesh
    {"id": "UP-SCA-001", "name": "UP SC Finance & Dev Corp (UPSCCFDC)", "type": "SCA", "state": "Uttar Pradesh", "district": "Lucknow", "latitude": 26.8467, "longitude": 80.9462, "npa_rate": 7.8, "fund_utilization_pct": 88.0, "contact_officer": "A. K. Sharma (Desk: 0522-261902)"},
    {"id": "UP-PSB-001", "name": "Punjab National Bank (Lead PSB)", "type": "PSB", "state": "Uttar Pradesh", "district": "Varanasi", "latitude": 25.3176, "longitude": 82.9739, "npa_rate": 3.1, "fund_utilization_pct": 96.0, "contact_officer": "V. Pandey (Desk: 0542-223456)"}, # High Utilization
    {"id": "UP-RRB-001", "name": "Aryavart Bank", "type": "RRB", "state": "Uttar Pradesh", "district": "Agra", "latitude": 27.1767, "longitude": 78.0081, "npa_rate": 5.4, "fund_utilization_pct": 72.0, "contact_officer": "M. Singh (Desk: 0562-234901)"},
    
    # Karnataka
    {"id": "KA-SCA-001", "name": "Dr. B.R. Ambedkar Dev Corp", "type": "SCA", "state": "Karnataka", "district": "Bengaluru", "latitude": 12.9716, "longitude": 77.5946, "npa_rate": 6.2, "fund_utilization_pct": 80.5, "contact_officer": "N. Gowda (Desk: 080-222333)"},
    {"id": "KA-PSB-001", "name": "Canara Bank", "type": "PSB", "state": "Karnataka", "district": "Mysuru", "latitude": 12.2958, "longitude": 76.6394, "npa_rate": 2.9, "fund_utilization_pct": 78.0, "contact_officer": "P. Kumar (Desk: 0821-244556)"},
    {"id": "KA-RRB-001", "name": "Karnataka Gramin Bank", "type": "RRB", "state": "Karnataka", "district": "Bengaluru", "latitude": 12.9300, "longitude": 77.6000, "npa_rate": 10.5, "fund_utilization_pct": 85.0, "contact_officer": "D. Shetty (Desk: 080-233445)"}, # High NPA
    
    # Andhra Pradesh
    {"id": "AP-SCA-001", "name": "APSCCFC", "type": "SCA", "state": "Andhra Pradesh", "district": "Vijayawada", "latitude": 16.5062, "longitude": 80.6480, "npa_rate": 4.1, "fund_utilization_pct": 65.0, "contact_officer": "T. Rao (Desk: 0866-243567)"},
    {"id": "AP-PSB-001", "name": "Union Bank of India", "type": "PSB", "state": "Andhra Pradesh", "district": "Visakhapatnam", "latitude": 17.6868, "longitude": 83.2185, "npa_rate": 3.7, "fund_utilization_pct": 70.0, "contact_officer": "S. Reddy (Desk: 0891-255678)"},
    {"id": "AP-RRB-001", "name": "Chaitanya Godavari Grameena Bank", "type": "RRB", "state": "Andhra Pradesh", "district": "Vijayawada", "latitude": 16.5200, "longitude": 80.6200, "npa_rate": 9.8, "fund_utilization_pct": 98.0, "contact_officer": "K. Prasad (Desk: 0866-224466)"}, # High Util
    
    # Kerala
    {"id": "KL-SCA-001", "name": "Kerala State SC/ST Dev Corp", "type": "SCA", "state": "Kerala", "district": "Thiruvananthapuram", "latitude": 8.5241, "longitude": 76.9366, "npa_rate": 2.1, "fund_utilization_pct": 55.0, "contact_officer": "A. Nair (Desk: 0471-233445)"},
    {"id": "KL-PSB-001", "name": "State Bank of India", "type": "PSB", "state": "Kerala", "district": "Kochi", "latitude": 9.9312, "longitude": 76.2673, "npa_rate": 1.5, "fund_utilization_pct": 60.0, "contact_officer": "M. Joseph (Desk: 0484-234567)"},
    {"id": "KL-RRB-001", "name": "Kerala Gramin Bank", "type": "RRB", "state": "Kerala", "district": "Thiruvananthapuram", "latitude": 8.5000, "longitude": 76.9000, "npa_rate": 12.0, "fund_utilization_pct": 65.0, "contact_officer": "V. Menon (Desk: 0471-245678)"}, # High NPA
    
    # National / Delhi NCR
    {"id": "DL-SCA-001", "name": "NSFDC Central Hub", "type": "SCA", "state": "Delhi", "district": "New Delhi", "latitude": 28.6139, "longitude": 77.2090, "npa_rate": 1.1, "fund_utilization_pct": 45.0, "contact_officer": "G. Singh (Desk: 011-233456)"},
    {"id": "DL-PSB-001", "name": "Bank of Baroda Micro-Hub", "type": "PSB", "state": "Delhi", "district": "South Delhi", "latitude": 28.5355, "longitude": 77.2410, "npa_rate": 2.5, "fund_utilization_pct": 85.0, "contact_officer": "R. Gupta (Desk: 011-244567)"},
    {"id": "DL-MFI-001", "name": "Muthoot Microfin", "type": "NBFC-MFI", "state": "Delhi", "district": "East Delhi", "latitude": 28.6200, "longitude": 77.3000, "npa_rate": 15.0, "fund_utilization_pct": 96.0, "contact_officer": "S. Verma (Desk: 011-255678)"} # High NPA & Util
]

out_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'branches.json')
os.makedirs(os.path.dirname(out_path), exist_ok=True)
with open(out_path, 'w', encoding='utf-8') as f:
    json.dump(branches, f, indent=4)

print(f"Seeded {len(branches)} branches successfully!")
