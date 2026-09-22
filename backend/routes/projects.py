from flask import Blueprint, jsonify

projects_bp = Blueprint("projects", __name__, url_prefix="/api/projects")


@projects_bp.route("")
def get_projects():
    projects_info = {
        "id": 6,
        "name": "Projects",
        "summary": "Actively deployed projects.",
        "project_items": [
            {
                "id": 1,
                "project_name": "Python/React Portfolio",
                "description": "This site — a React/Redux frontend backed by a Flask API, using CI/CD to automate deployment. This project was meant to assist me in recovering skills in Python, React, and Redux after a long hiatus from using those technologies. It also serves as a portfolio to showcase my skills and experience.",
                "url": "https://github.com/saesharutledgedev-beep/python-react-portfolio",
            },
        ],
    }
    return jsonify(projects_info)
