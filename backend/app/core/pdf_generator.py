import io
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from datetime import datetime

def generate_sanction_docket_pdf(app_data: dict, user_data: dict) -> io.BytesIO:
    buffer = io.BytesIO()
    
    # Standard margins
    doc = SimpleDocTemplate(
        buffer, pagesize=A4, 
        rightMargin=40, leftMargin=40, 
        topMargin=40, bottomMargin=40
    )
    
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'MainTitle', 
        parent=styles['Heading1'],
        fontSize=18,
        textColor=colors.HexColor('#0f172a'),
        alignment=1, # Center
        spaceAfter=15,
        fontName='Helvetica-Bold'
    )
    
    subtitle_style = ParagraphStyle(
        'SubTitle', 
        parent=styles['Normal'],
        fontSize=12,
        textColor=colors.HexColor('#475569'),
        alignment=1, # Center
        spaceAfter=25
    )
    
    header_style = ParagraphStyle(
        'SectionHeader', 
        parent=styles['Heading2'],
        fontSize=14,
        textColor=colors.HexColor('#ffffff'),
        backColor=colors.HexColor('#1e293b'),
        spaceBefore=15,
        spaceAfter=15,
        alignment=0,
        fontName='Helvetica-Bold',
        leftIndent=10,
        rightIndent=10,
        borderPadding=5
    )
    
    elements = []
    
    # 1. Header Section
    elements.append(Paragraph("GOVERNMENT OF INDIA &bull; MINISTRY OF SOCIAL JUSTICE & EMPOWERMENT", subtitle_style))
    elements.append(Paragraph("OFFICIAL CHANNEL FINANCE SANCTION DOCKET", title_style))
    
    # Add an elegant horizontal line
    elements.append(Spacer(1, 10))
    
    # 2. Key Tracking Info
    arn = app_data.get('arn', 'MOSJE-PENDING')
    date_str = datetime.now().strftime("%d %B %Y, %H:%M IST")
    
    tracking_data = [
        ['Application Tracking No:', arn, 'Date of Issuance:', date_str]
    ]
    tracking_table = Table(tracking_data, colWidths=[120, 160, 100, 130])
    tracking_table.setStyle(TableStyle([
        ('FONTNAME', (0,0), (-1,-1), 'Helvetica-Bold'),
        ('TEXTCOLOR', (0,0), (0,0), colors.HexColor('#64748b')),
        ('TEXTCOLOR', (2,0), (2,0), colors.HexColor('#64748b')),
        ('BOTTOMPADDING', (0,0), (-1,-1), 10),
        ('LINEBELOW', (0,0), (-1,-1), 1, colors.HexColor('#e2e8f0')),
    ]))
    elements.append(tracking_table)
    elements.append(Spacer(1, 20))
    
    # 3. Beneficiary Details
    elements.append(Paragraph("1. Verified Beneficiary Credentials", header_style))
    
    ben_data = [
        ['Applicant Name:', user_data.get('name', 'N/A'), 'Social Category:', 'Scheduled Caste (SC)'],
        ['Phone Number:', user_data.get('phone_number', 'N/A'), 'State:', app_data.get('branch_data', {}).get('state', 'N/A')]
    ]
    ben_table = Table(ben_data, colWidths=[120, 140, 110, 145])
    ben_table.setStyle(TableStyle([
        ('FONTNAME', (0,0), (-1,-1), 'Helvetica'),
        ('FONTNAME', (1,0), (1,-1), 'Helvetica-Bold'),
        ('FONTNAME', (3,0), (3,-1), 'Helvetica-Bold'),
        ('TEXTCOLOR', (0,0), (0,-1), colors.HexColor('#64748b')),
        ('TEXTCOLOR', (2,0), (2,-1), colors.HexColor('#64748b')),
        ('PADDING', (0,0), (-1,-1), 8),
    ]))
    elements.append(ben_table)
    elements.append(Spacer(1, 15))
    
    # 4. Approved Scheme & Financials
    elements.append(Paragraph("2. Approved Financial Scheme Structure", header_style))
    scheme = app_data.get('scheme_data', {})
    
    fin_data = [
        ['Scheme Name:', scheme.get('scheme_name', 'N/A')],
        ['Concessional Interest Rate:', f"{scheme.get('interest_rate_pct', 'N/A')}% p.a."],
        ['Loan Amount (90% MoSJE):', f"Rs. {scheme.get('loan_amount', 'N/A')}"],
        ['Promoter Share (10%):', f"Rs. {scheme.get('promoter_contribution_amount', 'N/A')}"],
        ['Moratorium Gestation:', f"{app_data.get('branch_data', {}).get('moratorium', '3')} Months"]
    ]
    fin_table = Table(fin_data, colWidths=[200, 315])
    fin_table.setStyle(TableStyle([
        ('FONTNAME', (0,0), (-1,-1), 'Helvetica'),
        ('FONTNAME', (1,0), (1,-1), 'Helvetica-Bold'),
        ('TEXTCOLOR', (0,0), (0,-1), colors.HexColor('#64748b')),
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f8fafc')),
        ('GRID', (0,0), (-1,-1), 1, colors.HexColor('#e2e8f0')),
        ('PADDING', (0,0), (-1,-1), 10),
    ]))
    elements.append(fin_table)
    elements.append(Spacer(1, 15))
    
    # 5. Routing Instructions
    elements.append(Paragraph("3. Channel Partner Routing Mandate", header_style))
    branch = app_data.get('branch_data', {})
    
    route_data = [
        ['Assigned Channel Partner:', branch.get('name', 'N/A')],
        ['Partner Classification:', branch.get('type', 'N/A')],
        ['District & State:', f"{branch.get('district', 'N/A')}, {branch.get('state', 'N/A')}"],
        ['Contact Officer:', branch.get('contact_officer', 'N/A')],
    ]
    route_table = Table(route_data, colWidths=[160, 355])
    route_table.setStyle(TableStyle([
        ('FONTNAME', (0,0), (-1,-1), 'Helvetica'),
        ('FONTNAME', (1,0), (1,0), 'Helvetica-Bold'),
        ('TEXTCOLOR', (1,0), (1,0), colors.HexColor('#047857')), # Green text for branch name
        ('TEXTCOLOR', (0,0), (0,-1), colors.HexColor('#64748b')),
        ('PADDING', (0,0), (-1,-1), 8),
    ]))
    elements.append(route_table)
    elements.append(Spacer(1, 40))
    
    # 6. Signatures (Bottom)
    sig_data = [
        ['______________________________', '______________________________'],
        ['Beneficiary Signature / Thumb', 'Authorized MoSJE Officer / Digital Sign']
    ]
    sig_table = Table(sig_data, colWidths=[250, 250])
    sig_table.setStyle(TableStyle([
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('FONTNAME', (0,1), (-1,1), 'Helvetica-Oblique'),
        ('TEXTCOLOR', (0,1), (-1,1), colors.HexColor('#64748b')),
    ]))
    elements.append(sig_table)
    
    # Build Document
    doc.build(elements)
    
    buffer.seek(0)
    return buffer
