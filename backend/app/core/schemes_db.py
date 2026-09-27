import json

SCHEMES_DB = [
    {
        "scheme_id": "NSFDC-MSY-2026",
        "scheme_name": "Mahila Samriddhi Yojana (MSY)",
        "ministry": "Ministry of Social Justice & Empowerment (MoSJE)",
        "corporation": "National Scheduled Castes Finance and Development Corporation (NSFDC)",
        "type": "Loan / Credit",
        "sector": [
            "All",
            "Services",
            "Retail",
            "Manufacturing"
        ],
        "audience": [
            "Women",
            "SC"
        ],
        "state_applicability": "Pan-India",
        "interest_rate_pct": 4.0,
        "max_loan_limit": 140000.0,
        "description": "Micro-finance scheme exclusively for female entrepreneurs belonging to Scheduled Castes to start small-scale businesses.",
        "financial_assistance": "NSFDC provides loans up to \u20b91.40 Lakhs. The interest rate is strictly 4% p.a.",
        "eligibility_criteria": [
            "Must belong to Scheduled Caste (SC)",
            "Applicant must be Female",
            "Annual Income < \u20b93.00 Lakhs"
        ],
        "documents_required": [
            "Caste Certificate",
            "Income Certificate",
            "Aadhaar Card",
            "Project Report"
        ],
        "target_purposes": [
            "Retail Grocery / Kirana",
            "Tailoring / Textile Unit"
        ],
        "target_stages": [
            "Ideation / Planning",
            "Seed / Early-Stage"
        ],
        "target_education": [
            "Not Applicable (Business Loan)"
        ]
    },
    {
        "scheme_id": "NSFDC-TL-2026",
        "scheme_name": "NSFDC Term Loan Scheme",
        "ministry": "Ministry of Social Justice & Empowerment (MoSJE)",
        "corporation": "NSFDC",
        "type": "Loan / Credit",
        "sector": [
            "Manufacturing",
            "Services",
            "All"
        ],
        "audience": [
            "All",
            "SC"
        ],
        "state_applicability": "Pan-India",
        "interest_rate_pct": 6.0,
        "max_loan_limit": 5000000.0,
        "description": "General term loan scheme for setting up commercially viable projects in any sector.",
        "financial_assistance": "Loans up to \u20b950.00 Lakhs. Interest ranges from 6% to 8% depending on loan slab.",
        "eligibility_criteria": [
            "Must belong to Scheduled Caste (SC)",
            "Annual Income < \u20b93.00 Lakhs"
        ],
        "documents_required": [
            "Caste Certificate",
            "Income Certificate",
            "Detailed Project Report",
            "Quotations"
        ],
        "target_purposes": [
            "Retail Grocery / Kirana",
            "Agriculture / Tractor / Land Purchase"
        ],
        "target_stages": [
            "Growth / Expansion",
            "Seed / Early-Stage"
        ],
        "target_education": []
    },
    {
        "scheme_id": "NSFDC-MCF-2026",
        "scheme_name": "Micro Credit Finance (MCF)",
        "ministry": "Ministry of Social Justice & Empowerment (MoSJE)",
        "corporation": "NSFDC",
        "type": "Loan / Credit",
        "sector": [
            "All",
            "Retail"
        ],
        "audience": [
            "All",
            "SC"
        ],
        "state_applicability": "Pan-India",
        "interest_rate_pct": 5.0,
        "max_loan_limit": 140000.0,
        "description": "Small credit facility for SC individuals living below double the poverty line.",
        "financial_assistance": "Loans up to \u20b91.40 Lakhs at 5% p.a. interest.",
        "eligibility_criteria": [
            "SC Category",
            "Income < \u20b93.00 Lakhs"
        ],
        "documents_required": [
            "Caste Certificate",
            "Income Certificate"
        ],
        "target_purposes": [
            "Retail Grocery / Kirana",
            "Tailoring / Textile Unit"
        ],
        "target_stages": [
            "Ideation / Planning",
            "Seed / Early-Stage"
        ],
        "target_education": []
    },
    {
        "scheme_id": "NSFDC-ELS-2026",
        "scheme_name": "Education Loan Scheme (ELS)",
        "ministry": "Ministry of Social Justice & Empowerment (MoSJE)",
        "corporation": "NSFDC",
        "type": "Education Loan",
        "sector": [
            "Education"
        ],
        "audience": [
            "Students",
            "SC"
        ],
        "state_applicability": "Pan-India",
        "interest_rate_pct": 4.0,
        "max_loan_limit": 2000000.0,
        "description": "Financial assistance for SC students pursuing full-time professional/technical courses in India or abroad.",
        "financial_assistance": "Loans up to \u20b920 Lakhs for domestic studies and \u20b930 Lakhs for foreign studies at 4% p.a.",
        "eligibility_criteria": [
            "SC Category",
            "Admission to recognized technical/professional course"
        ],
        "documents_required": [
            "Admission Letter",
            "Fee Structure",
            "Caste Certificate",
            "Income Certificate"
        ],
        "target_purposes": [
            "Higher Education (ELS)"
        ],
        "target_stages": [
            "Ideation / Planning"
        ],
        "target_education": [
            "B.Tech / Professional Degree",
            "Diploma / Technical Course",
            "Medical / MBBS"
        ]
    },
    {
        "scheme_id": "NSFDC-SUY-2026",
        "scheme_name": "Swachhta Udyami Yojana (SUY)",
        "ministry": "Ministry of Social Justice & Empowerment (MoSJE)",
        "corporation": "NSFDC",
        "type": "Loan / Credit",
        "sector": [
            "Sanitation",
            "Waste Management"
        ],
        "audience": [
            "Safai Karamcharis",
            "SC"
        ],
        "state_applicability": "Pan-India",
        "interest_rate_pct": 4.0,
        "max_loan_limit": 5000000.0,
        "description": "Financing for procurement of sanitation related equipment/vehicles and construction of pay-and-use toilets.",
        "financial_assistance": "Loans up to \u20b950.00 Lakhs at 4% p.a.",
        "eligibility_criteria": [
            "Targeted at Safai Karamcharis, Manual Scavengers or their dependents."
        ],
        "documents_required": [
            "Caste Certificate",
            "Occupation Certificate",
            "Project Report"
        ],
        "target_purposes": [
            "Sanitation / Waste Management"
        ],
        "target_stages": [
            "Seed / Early-Stage",
            "Growth / Expansion"
        ],
        "target_education": []
    },
    {
        "scheme_id": "NSFDC-CV-2026",
        "scheme_name": "Commercial Vehicle Finance Scheme",
        "ministry": "Ministry of Social Justice & Empowerment (MoSJE)",
        "corporation": "NSFDC",
        "type": "Loan / Credit",
        "sector": [
            "Transport",
            "Services"
        ],
        "audience": [
            "All",
            "SC"
        ],
        "state_applicability": "Pan-India",
        "interest_rate_pct": 6.0,
        "max_loan_limit": 1500000.0,
        "description": "Financial assistance to purchase commercial vehicles like taxis, tractors, or goods carriers.",
        "financial_assistance": "Loans up to \u20b915.00 Lakhs at 6% p.a.",
        "eligibility_criteria": [
            "SC Category",
            "Valid Commercial Driving License (if self-driven)"
        ],
        "documents_required": [
            "Driving License",
            "Vehicle Quotation",
            "Caste Certificate"
        ],
        "target_purposes": [
            "Auto Rickshaw / Tourist Taxi",
            "Green / Solar / Electric Vehicle (EV)"
        ],
        "target_stages": [
            "Seed / Early-Stage"
        ],
        "target_education": []
    },
    {
        "scheme_id": "NSFDC-GLC-2026",
        "scheme_name": "Green Loan / Solar Scheme",
        "ministry": "Ministry of Social Justice & Empowerment (MoSJE)",
        "corporation": "NSFDC",
        "type": "Loan / Credit",
        "sector": [
            "Energy",
            "Green"
        ],
        "audience": [
            "All",
            "SC"
        ],
        "state_applicability": "Pan-India",
        "interest_rate_pct": 5.0,
        "max_loan_limit": 2500000.0,
        "description": "Subsidized loans for setting up solar plants, EV charging stations, and green businesses.",
        "financial_assistance": "Up to \u20b925 Lakhs with 5% interest rate and upfront subsidy.",
        "eligibility_criteria": [
            "SC Category",
            "Green Business Focus"
        ],
        "documents_required": [
            "Project Report",
            "Caste Certificate"
        ],
        "target_purposes": [
            "Green / Solar / Electric Vehicle (EV)"
        ],
        "target_stages": [
            "Seed / Early-Stage",
            "Growth / Expansion"
        ],
        "target_education": []
    },
    {
        "scheme_id": "NSFDC-LPS-2026",
        "scheme_name": "Land Purchase Scheme",
        "ministry": "Ministry of Social Justice & Empowerment (MoSJE)",
        "corporation": "NSFDC",
        "type": "Loan / Credit",
        "sector": [
            "Agriculture"
        ],
        "audience": [
            "Farmers",
            "SC"
        ],
        "state_applicability": "Pan-India",
        "interest_rate_pct": 6.0,
        "max_loan_limit": 3000000.0,
        "description": "Financial assistance to SC landless agricultural laborers for the purchase of agricultural land.",
        "financial_assistance": "Loans up to \u20b930 Lakhs.",
        "eligibility_criteria": [
            "Must be a landless agricultural laborer",
            "SC Category"
        ],
        "documents_required": [
            "Income Certificate",
            "Caste Certificate",
            "Land Records"
        ],
        "target_purposes": [
            "Agriculture / Tractor / Land Purchase"
        ],
        "target_stages": [
            "Ideation / Planning"
        ],
        "target_education": []
    },
    {
        "scheme_id": "NSFDC-SHG-2026",
        "scheme_name": "Self Help Group (SHG) Finance",
        "ministry": "Ministry of Social Justice & Empowerment (MoSJE)",
        "corporation": "NSFDC",
        "type": "Loan / Credit",
        "sector": [
            "All"
        ],
        "audience": [
            "Women",
            "SHG",
            "SC"
        ],
        "state_applicability": "Pan-India",
        "interest_rate_pct": 5.0,
        "max_loan_limit": 500000.0,
        "description": "Group finance scheme for registered SHGs with majority SC members.",
        "financial_assistance": "Loans up to \u20b95 Lakhs per SHG.",
        "eligibility_criteria": [
            "SHG must be registered",
            "Majority members must be SC"
        ],
        "documents_required": [
            "SHG Registration",
            "Member List",
            "Caste Certificates"
        ],
        "target_purposes": [
            "Retail Grocery / Kirana",
            "Tailoring / Textile Unit"
        ],
        "target_stages": [
            "Seed / Early-Stage"
        ],
        "target_education": []
    },
    {
        "scheme_id": "TAHDCO-TL-2026",
        "scheme_name": "TAHDCO Entrepreneur Development Program (EDP)",
        "ministry": "Govt of Tamil Nadu",
        "corporation": "TAHDCO",
        "type": "Loan / Credit",
        "sector": [
            "All"
        ],
        "audience": [
            "All",
            "SC",
            "ST"
        ],
        "state_applicability": "Tamil Nadu",
        "interest_rate_pct": 6.0,
        "max_loan_limit": 1500000.0,
        "description": "State-specific financial assistance for SC/ST individuals in Tamil Nadu to start businesses.",
        "financial_assistance": "Margin money subsidy of up to 30% of project cost (max \u20b92.25 Lakhs).",
        "eligibility_criteria": [
            "Resident of Tamil Nadu",
            "SC/ST Category",
            "Age 18-65"
        ],
        "documents_required": [
            "Tamil Nadu Domicile",
            "Caste Certificate",
            "Aadhaar"
        ],
        "target_purposes": [
            "Retail Grocery / Kirana",
            "Pharmacy / Medical Clinic",
            "Tailoring / Textile Unit"
        ],
        "target_stages": [
            "Seed / Early-Stage",
            "Growth / Expansion"
        ],
        "target_education": []
    },
    {
        "scheme_id": "TAHDCO-YOUTH-2026",
        "scheme_name": "TAHDCO Youth Self-Employment Scheme",
        "ministry": "Govt of Tamil Nadu",
        "corporation": "TAHDCO",
        "type": "Loan / Grant",
        "sector": [
            "Clinic",
            "Healthcare",
            "Professional"
        ],
        "audience": [
            "Youth",
            "SC",
            "ST"
        ],
        "state_applicability": "Tamil Nadu",
        "interest_rate_pct": 5.0,
        "max_loan_limit": 1000000.0,
        "description": "Special scheme for young SC/ST professionals (Doctors, Engineers, Lawyers) to set up their practice.",
        "financial_assistance": "Up to \u20b910 Lakhs loan with heavy front-loaded state subsidy.",
        "eligibility_criteria": [
            "Resident of Tamil Nadu",
            "Age 18-35",
            "Professional Degree"
        ],
        "documents_required": [
            "Professional Degree Certificate",
            "State Domicile"
        ],
        "target_purposes": [
            "Pharmacy / Medical Clinic"
        ],
        "target_stages": [
            "Seed / Early-Stage"
        ],
        "target_education": [
            "B.Tech / Professional Degree",
            "Medical / MBBS"
        ]
    },
    {
        "scheme_id": "UP-SCFC-2026",
        "scheme_name": "Uttar Pradesh SC Finance Scheme (MKY)",
        "ministry": "Govt of Uttar Pradesh",
        "corporation": "UP Scheduled Castes Finance and Development Corporation",
        "type": "Loan / Subsidy",
        "sector": [
            "All"
        ],
        "audience": [
            "SC"
        ],
        "state_applicability": "Uttar Pradesh",
        "interest_rate_pct": 5.5,
        "max_loan_limit": 1200000.0,
        "description": "Mukhyamantri Gramodyog Rojgar Yojana tailored for SC families in UP to set up rural enterprises.",
        "financial_assistance": "Loans up to \u20b912 Lakhs with 25% state margin money subsidy.",
        "eligibility_criteria": [
            "Resident of UP",
            "SC Category",
            "Rural area resident"
        ],
        "documents_required": [
            "UP Domicile",
            "Caste Certificate",
            "Gram Panchayat NOC"
        ],
        "target_purposes": [
            "Agriculture / Tractor / Land Purchase",
            "Retail Grocery / Kirana"
        ],
        "target_stages": [
            "Seed / Early-Stage"
        ],
        "target_education": []
    },
    {
        "scheme_id": "MAH-LMP-2026",
        "scheme_name": "Lokshahir Annabhau Sathe Vikas Mahamandal",
        "ministry": "Govt of Maharashtra",
        "corporation": "LASVDC",
        "type": "Loan / Credit",
        "sector": [
            "Retail",
            "Services"
        ],
        "audience": [
            "SC"
        ],
        "state_applicability": "Maharashtra",
        "interest_rate_pct": 5.0,
        "max_loan_limit": 700000.0,
        "description": "Financial assistance for SC youth in Maharashtra to start service-based businesses.",
        "financial_assistance": "Loans up to \u20b97.00 Lakhs. Margin money subsidy of \u20b910,000 provided by state.",
        "eligibility_criteria": [
            "Resident of Maharashtra",
            "SC Category",
            "Age 18-50"
        ],
        "documents_required": [
            "Maharashtra Domicile",
            "Caste Certificate",
            "Project Report"
        ],
        "target_purposes": [
            "Retail Grocery / Kirana",
            "Tailoring / Textile Unit"
        ],
        "target_stages": [
            "Seed / Early-Stage"
        ],
        "target_education": []
    },
    {
        "scheme_id": "MP-SDF-2026",
        "scheme_name": "MP SC Cooperative Finance Scheme",
        "ministry": "Govt of Madhya Pradesh",
        "corporation": "MP State Cooperative Scheduled Castes Finance Corp",
        "type": "Loan / Credit",
        "sector": [
            "Agriculture",
            "Manufacturing"
        ],
        "audience": [
            "SC"
        ],
        "state_applicability": "Madhya Pradesh",
        "interest_rate_pct": 5.5,
        "max_loan_limit": 1500000.0,
        "description": "Capital assistance for agro-based industries and small manufacturing in MP.",
        "financial_assistance": "Term loans up to \u20b915 Lakhs at 5.5% p.a. Includes 30% state subsidy.",
        "eligibility_criteria": [
            "Resident of MP",
            "SC Category"
        ],
        "documents_required": [
            "MP Samagra ID",
            "Caste Certificate"
        ],
        "target_purposes": [
            "Agriculture / Tractor / Land Purchase",
            "Sanitation / Waste Management"
        ],
        "target_stages": [
            "Growth / Expansion",
            "Seed / Early-Stage"
        ],
        "target_education": []
    },
    {
        "scheme_id": "HAR-SCFC-2026",
        "scheme_name": "Haryana SCFC Micro Credit",
        "ministry": "Govt of Haryana",
        "corporation": "Haryana Scheduled Castes Finance and Development Corp",
        "type": "Loan / Credit",
        "sector": [
            "Retail",
            "Dairy"
        ],
        "audience": [
            "SC"
        ],
        "state_applicability": "Haryana",
        "interest_rate_pct": 6.0,
        "max_loan_limit": 500000.0,
        "description": "Small credit scheme for setting up dairy units or retail shops in Haryana.",
        "financial_assistance": "Loans up to \u20b95.00 Lakhs. 50% subsidy on dairy equipment.",
        "eligibility_criteria": [
            "Resident of Haryana",
            "SC Category",
            "Income < \u20b93 Lakhs"
        ],
        "documents_required": [
            "Haryana Parivar Pehchan Patra",
            "Caste Certificate"
        ],
        "target_purposes": [
            "Retail Grocery / Kirana",
            "Agriculture / Tractor / Land Purchase"
        ],
        "target_stages": [
            "Seed / Early-Stage"
        ],
        "target_education": []
    },
    {
        "scheme_id": "GUJ-GSDC-2026",
        "scheme_name": "Gujarat SCDC Self-Employment Scheme",
        "ministry": "Govt of Gujarat",
        "corporation": "Gujarat Safai Kamdar Development Corporation",
        "type": "Loan / Credit",
        "sector": [
            "Sanitation",
            "Services"
        ],
        "audience": [
            "SC",
            "Safai Karamcharis"
        ],
        "state_applicability": "Gujarat",
        "interest_rate_pct": 4.0,
        "max_loan_limit": 1000000.0,
        "description": "Alternate livelihood finance for Safai Kamdars in Gujarat.",
        "financial_assistance": "Loans up to \u20b910 Lakhs at 4% p.a. with massive upfront capital subsidy.",
        "eligibility_criteria": [
            "Resident of Gujarat",
            "Safai Kamdar or SC Category"
        ],
        "documents_required": [
            "Gujarat Domicile",
            "Occupation Certificate"
        ],
        "target_purposes": [
            "Sanitation / Waste Management"
        ],
        "target_stages": [
            "Seed / Early-Stage"
        ],
        "target_education": []
    },
    {
        "scheme_id": "WB-SCST-2026",
        "scheme_name": "WB SC/ST Development Finance Scheme",
        "ministry": "Govt of West Bengal",
        "corporation": "WB SC ST Development and Finance Corporation",
        "type": "Loan / Credit",
        "sector": [
            "Agriculture",
            "Retail"
        ],
        "audience": [
            "SC"
        ],
        "state_applicability": "West Bengal",
        "interest_rate_pct": 5.0,
        "max_loan_limit": 600000.0,
        "description": "Financial support for SC youth in West Bengal for farming and small retail.",
        "financial_assistance": "Loans up to \u20b96.00 Lakhs with 20% state subsidy.",
        "eligibility_criteria": [
            "Resident of West Bengal",
            "SC Category"
        ],
        "documents_required": [
            "WB Domicile",
            "Caste Certificate"
        ],
        "target_purposes": [
            "Agriculture / Tractor / Land Purchase",
            "Retail Grocery / Kirana"
        ],
        "target_stages": [
            "Seed / Early-Stage"
        ],
        "target_education": []
    },
    {
        "scheme_id": "ODI-OSFDC-2026",
        "scheme_name": "Odisha OSFDC Term Loan",
        "ministry": "Govt of Odisha",
        "corporation": "Odisha Scheduled Caste and Scheduled Tribe Finance Dev Corp",
        "type": "Loan / Credit",
        "sector": [
            "All"
        ],
        "audience": [
            "SC"
        ],
        "state_applicability": "Odisha",
        "interest_rate_pct": 6.0,
        "max_loan_limit": 1000000.0,
        "description": "Credit scheme for tribal and SC communities in Odisha to start sustainable businesses.",
        "financial_assistance": "Up to \u20b910 Lakhs at 6% p.a. with 25% backend subsidy.",
        "eligibility_criteria": [
            "Resident of Odisha",
            "SC Category"
        ],
        "documents_required": [
            "Odisha Domicile",
            "Caste Certificate"
        ],
        "target_purposes": [
            "Tailoring / Textile Unit",
            "Auto Rickshaw / Tourist Taxi"
        ],
        "target_stages": [
            "Seed / Early-Stage"
        ],
        "target_education": []
    },
    {
        "scheme_id": "BIH-MVM-2026",
        "scheme_name": "Bihar Mahadalit Vikas Mission Entrepreneurship",
        "ministry": "Govt of Bihar",
        "corporation": "Mahadalit Vikas Mission",
        "type": "Grant / Subsidy",
        "sector": [
            "Manufacturing",
            "Services"
        ],
        "audience": [
            "SC",
            "Mahadalit"
        ],
        "state_applicability": "Bihar",
        "interest_rate_pct": 4.0,
        "max_loan_limit": 500000.0,
        "description": "Exclusive scheme for Mahadalit families in Bihar to set up micro-manufacturing units.",
        "financial_assistance": "Direct grant of \u20b91.00 Lakh and subsidized loan up to \u20b94.00 Lakhs at 4% p.a.",
        "eligibility_criteria": [
            "Resident of Bihar",
            "SC (Mahadalit) Category"
        ],
        "documents_required": [
            "Bihar Domicile",
            "Caste Certificate",
            "Aadhaar"
        ],
        "target_purposes": [
            "Tailoring / Textile Unit",
            "Retail Grocery / Kirana"
        ],
        "target_stages": [
            "Seed / Early-Stage"
        ],
        "target_education": []
    },
    {
        "scheme_id": "RAJ-SCDC-2026",
        "scheme_name": "Rajasthan Anuprati / SC Finance Scheme",
        "ministry": "Govt of Rajasthan",
        "corporation": "Rajasthan Scheduled Castes Finance & Dev Corp",
        "type": "Loan / Credit",
        "sector": [
            "All"
        ],
        "audience": [
            "SC"
        ],
        "state_applicability": "Rajasthan",
        "interest_rate_pct": 6.0,
        "max_loan_limit": 1000000.0,
        "description": "Enterprise assistance for SC individuals in Rajasthan to start small-scale industries.",
        "financial_assistance": "Loans up to \u20b910.00 Lakhs at 6% p.a. State contributes 15% upfront subsidy.",
        "eligibility_criteria": [
            "Resident of Rajasthan",
            "SC Category",
            "Income < \u20b92.5 Lakhs"
        ],
        "documents_required": [
            "Bhamashah Card",
            "Caste Certificate",
            "Income Certificate"
        ],
        "target_purposes": [
            "Agriculture / Tractor / Land Purchase",
            "Auto Rickshaw / Tourist Taxi"
        ],
        "target_stages": [
            "Seed / Early-Stage",
            "Growth / Expansion"
        ],
        "target_education": []
    },
    {
        "scheme_id": "NSFDC-AWG-2026",
        "scheme_name": "Artisan / Weaver Grant Scheme",
        "ministry": "Ministry of Social Justice & Empowerment (MoSJE)",
        "corporation": "NSFDC",
        "type": "Grant / Loan",
        "sector": [
            "Textile",
            "Artisan"
        ],
        "audience": [
            "Artisans",
            "SC"
        ],
        "state_applicability": "Pan-India",
        "interest_rate_pct": 3.5,
        "max_loan_limit": 500000.0,
        "description": "Special scheme to uplift SC weavers and traditional artisans by providing cheap capital and modern looms.",
        "financial_assistance": "Loans up to \u20b95.00 Lakhs at 3.5% p.a. and direct grant of \u20b950,000 for loom upgrade.",
        "eligibility_criteria": [
            "SC Category",
            "Registered Artisan / Weaver"
        ],
        "documents_required": [
            "Artisan ID Card",
            "Caste Certificate"
        ],
        "target_purposes": [
            "Tailoring / Textile Unit"
        ],
        "target_stages": [
            "Growth / Expansion"
        ],
        "target_education": []
    },
    {
        "scheme_id": "NSFDC-TECH-2026",
        "scheme_name": "Technology Upgradation Fund Scheme",
        "ministry": "Ministry of Social Justice & Empowerment (MoSJE)",
        "corporation": "NSFDC",
        "type": "Loan / Credit",
        "sector": [
            "IT",
            "Manufacturing"
        ],
        "audience": [
            "SC"
        ],
        "state_applicability": "Pan-India",
        "interest_rate_pct": 5.0,
        "max_loan_limit": 2000000.0,
        "description": "Funding for SC-owned enterprises to upgrade their technology, purchase software, or modernize machinery.",
        "financial_assistance": "Loans up to \u20b920 Lakhs with 15% capital subsidy.",
        "eligibility_criteria": [
            "SC Category",
            "Existing Business > 2 Years"
        ],
        "documents_required": [
            "GST Returns",
            "Caste Certificate",
            "Vendor Invoice"
        ],
        "target_purposes": [
            "Green / Solar / Electric Vehicle (EV)"
        ],
        "target_stages": [
            "Growth / Expansion"
        ],
        "target_education": []
    },
    {
        "scheme_id": "KERALA-SCST-2026",
        "scheme_name": "Kerala SC/ST Development Corporation Enterprise Loan",
        "ministry": "Govt of Kerala",
        "corporation": "Kerala State SC/ST Dev Corp",
        "type": "Loan / Credit",
        "sector": [
            "All"
        ],
        "audience": [
            "SC",
            "ST"
        ],
        "state_applicability": "Kerala",
        "interest_rate_pct": 5.5,
        "max_loan_limit": 1500000.0,
        "description": "Self-employment assistance targeting unemployed SC/ST youth in Kerala.",
        "financial_assistance": "Term loans up to \u20b915 Lakhs. Special interest subvention for women.",
        "eligibility_criteria": [
            "Resident of Kerala",
            "SC/ST Category",
            "Unemployed"
        ],
        "documents_required": [
            "Kerala Domicile",
            "Caste Certificate"
        ],
        "target_purposes": [
            "Pharmacy / Medical Clinic",
            "Retail Grocery / Kirana"
        ],
        "target_stages": [
            "Seed / Early-Stage"
        ],
        "target_education": []
    },
    {
        "scheme_id": "PUNJAB-SCFC-2026",
        "scheme_name": "Punjab SCFC Transport Scheme",
        "ministry": "Govt of Punjab",
        "corporation": "Punjab SC Land Development and Finance Corp",
        "type": "Loan / Credit",
        "sector": [
            "Transport"
        ],
        "audience": [
            "SC"
        ],
        "state_applicability": "Punjab",
        "interest_rate_pct": 6.0,
        "max_loan_limit": 1200000.0,
        "description": "Assistance for SC youth in Punjab to purchase commercial vehicles (Mini buses, Taxis).",
        "financial_assistance": "Loans up to \u20b912 Lakhs at 6% p.a.",
        "eligibility_criteria": [
            "Resident of Punjab",
            "SC Category",
            "Commercial Driving License"
        ],
        "documents_required": [
            "Punjab Domicile",
            "Caste Certificate",
            "Driving License"
        ],
        "target_purposes": [
            "Auto Rickshaw / Tourist Taxi"
        ],
        "target_stages": [
            "Seed / Early-Stage"
        ],
        "target_education": []
    }
]