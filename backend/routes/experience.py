from flask import Blueprint, jsonify

experience_info_bp = Blueprint("experience-info", __name__, url_prefix="/api/experience-info")


@experience_info_bp.route("")
def get_experience_info():
    experience_info = {
            "id": 3,
            "name": "Experience",
            "experience_items": [
                {
                    "label": "VisualVault",
                    "title": "Solutions Architect",
                    "dates": "May 2023 – Present",
                    "details": """• Lead technical direction and manage a team of 12 developers and 5 QA engineers through implementation and UAT phases, delivering an on-schedule statewide launch to replace the Department of Health's 2016 platform.
• Reconstruct the agency's undocumented legacy process through twice-weekly working sessions with stakeholders, translating it into business rules, workflows, system designs, and user stories they review and approve, then expand scope to new statutory requirements on AWS.
• Define the field-level validation and cleansing rules required to migrate legacy records the prior system never validated, working without documentation or cooperation from the outgoing vendor.
• Deliver the Department of Health's first owned, queryable view of its registry population. The agency's published statistics are generated from this data model: nearly 30,000 active patients and designated providers, 300+ medically endorsed retailers, and 14,000+ card transactions in the first half of 2026.
• Design the registry's Fiserv payments system, replacing manual fee collection and mailed notices with electronic payment and automated enforcement: delinquent retailers retain system access only to settle outstanding balances, a compliance lever the agency previously lacked.
• Run refinement, standups, sprint reviews, and retrospectives, with QA reviewing stories ahead of refinement so testers understand intent before build; own the Jira backlog and build dashboards tracking delivery metrics for delivery managers and executives.
• Serve as lead architect for system, data, and API design, including the permissions model and REST APIs; build backend services in Node.js, Express, and TypeScript with Sequelize-based SQL persistence, mentor engineers through code review, and stay hands-on as a developer using Claude Code and GitHub Copilot.""",
                },
                {
                    "label": "Macy's",
                    "title": "Software Engineer, Browse & Search",
                    "dates": "Mar 2022 – May 2023",
                    "details": """• Shipped browse and search features on macys.com and bloomingdales.com, platforms drawing roughly 70 million combined monthly visits; partnered with product managers, QA, and business stakeholders to define acceptance criteria before implementation.
• Implemented integrations against large-scale enterprise infrastructure, navigating cross-team dependencies at a global retailer.
• Improved release reliability through test-driven development in Jest, debugging, and root-cause analysis; drove engagement in daily standups, sprint planning, and retrospectives.""",
                },
                {
                    "label": "ProCom Consulting",
                    "title": "Software Engineer",
                    "dates": "Mar 2021 – Mar 2022",
                    "details": """• Lead developer for payments and refunds on the State of Nebraska licensure system, building from vague requirements with no existing documentation; translated business intent into implementable behavior and mapped downstream impacts across connected services.
• Designed and engineered the PayPal Payflow integration with the LANCE enterprise platform; partnered with QA on validation scenarios, and authored the payments architecture and business-rule documentation the team worked from after handoff.""",
                },
                {
                    "label": "Salepoint LLC",
                    "title": "Software Engineer",
                    "dates": "Apr 2020 – Mar 2021",
                    "details": """• Reverse-engineered the legacy Oracle Forms reports and logic driving supply chain management for Department of Defense AAFES stores, migrating the merchandising infrastructure to Oracle APEX and documenting the rules for replication in PL/SQL.
• Held Public Trust clearance for the duration of the federal engagement.""",
                },
            ]
        }

    return jsonify(experience_info)
