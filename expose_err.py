with open('frontend/src/App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("showToast({type: 'error', message: \"Failed to submit application.\"});", "showToast({type: 'error', message: \"Error: \" + (err.response?.data?.detail || err.message || \"Failed\")});")

with open('frontend/src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
