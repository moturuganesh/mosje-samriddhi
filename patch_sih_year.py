import os

with open('frontend/src/pages/LandingPage.jsx', 'r', encoding='utf-8') as f:
    lp = f.read()

lp = lp.replace("(SIH 2024)", "(SIH 2026)").replace("© 2024", "© 2026")

with open('frontend/src/pages/LandingPage.jsx', 'w', encoding='utf-8') as f:
    f.write(lp)
