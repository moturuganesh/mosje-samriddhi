with open('backend/app/api/applications.py', 'rb') as f:
    content = f.read()

idx = content.find(b'@ r o u t e r . d e l e t e')
if idx == -1:
    idx = content.find(b'\x00@\x00 \x00r\x00o\x00u\x00t\x00e\x00r')
    if idx == -1:
        # Just find the end of the return result
        idx = content.rfind(b'return result') + 13

if idx != -1:
    clean_content = content[:idx].decode('utf-8', errors='ignore')
else:
    clean_content = content.decode('utf-8', errors='ignore')

clean_content = clean_content.strip() + '''

@router.delete("/{arn}")
def delete_application(arn: str, db: Session = Depends(get_db)):
    app = db.query(Application).filter(Application.arn == arn).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
        
    db.delete(app)
    db.commit()
    return {"message": "Application deleted successfully"}
'''

with open('backend/app/api/applications.py', 'w', encoding='utf-8') as f:
    f.write(clean_content)
