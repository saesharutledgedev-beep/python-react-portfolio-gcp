from flask import Blueprint, jsonify

skills_bp = Blueprint("skills", __name__, url_prefix="/api/skills")


@skills_bp.route("")
def get_skills():
    skills = {
            "id": 5,
            "name": "Technical Skills",
            "skills_info": [
                { "label": 'Technical Skills', 
                    'details': """Solution architecture | Microservice architecture | Integration design | Data modeling | JavaScript |  Python |  SQL |  Debugging |  API design (REST) |  Database design |  System design |  Application design |  Software architecture |  Node.js |  CSS/SCSS |  HTML |  TypeScript |  EJS |  Agentic coding skills""" },
                { "label": 'Professional Skills', 
                    "details": """Stakeholder management |  Requirements elicitation |  Technical documentation |  Code reviews |  Mentoring & technical leadership |  Risk/tradeoff analysis |  Root‑cause analysis |  Unit & functional testing |  Product design |  HIPAA compliance |  Peer review |  Autonomous coding |  Strong verbal communication |  Public Trust Clearance""" },
                {
                    "label": 'Tooling',
                    "details": """Figma |  PostgreSQL |  Oracle DB |  Sequelize |  Express |  Jest |  Jira |  GitHub Copilot |  Claude Code |  Miro |  Confluence |  Atlassian""",
                }
            ],
        }

    return jsonify(skills)
