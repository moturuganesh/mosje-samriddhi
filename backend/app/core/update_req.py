import os
import re

schema_path = 'backend/app/models/schemas.py'
with open(schema_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace RouteRequest
old_req_match = re.search(r'class RouteRequest\(BaseModel\):.*?(class RouteResponse\(BaseModel\):)', content, flags=re.DOTALL)
if old_req_match:
    old_req = old_req_match.group(0).replace('class RouteResponse(BaseModel):', '').strip()
    new_req = """class RouteRequest(BaseModel):
    state: Optional[str] = None
    district: Optional[str] = None
    user_lat: float
    user_lng: float
"""
    content = content.replace(old_req, new_req)

with open(schema_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated schemas.")
