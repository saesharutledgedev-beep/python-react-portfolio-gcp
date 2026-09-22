from flask import Blueprint, jsonify

education_info_bp = Blueprint("education-info", __name__, url_prefix="/api/education-info")


@education_info_bp.route("")
def get_education_info():
    education_info = {
            "id": 4,
            "name": "Education",
            "summary": "From one creative field to another.",
            "education_info": [
                { "label": 'DigitalCrafts', 
                    'details': """Certificate: Full Stack Software Engineering DigitalCrafts
Coursework: JavaScript, Node.js/Express, React, Redux, EJS, RESTful APIs, SQL, Python""" },
                { "label": "University of Kentucky", 
                    "details": """Achievements: Earned 4.0 GPA,Published peer-reviewed research, presented internationally, taught university-level courses, authored a 550-page dissertation""" },
                {
                    "label": 'West Virginia University',
                    "details": """Achievements: Taught university-level courses, earned 3.9 GPA, authored a 150-page thesis""",
                },
                {
                    "label": 'University of Washington',
                    "details": """Achievements: Performed in multiple ensembles, achieved 3.8 GPA""",
                },
                {
                    "label": 'Boise State University',
                    "details": """Achievements: Taught private an university private lessons, performed professionally in Boise, ID, earned 3.8 GPA""",
                },
            ],           
        }
    
    return jsonify(education_info)
