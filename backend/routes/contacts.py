from flask import Blueprint, jsonify

contacts_bp = Blueprint("contacts", __name__, url_prefix="/api/contacts")


@contacts_bp.route("")
def get_contacts():
    contacts = {
            "id": 7,
            "name": "Contact",
            "tagline": "AI‑Forward Product Manager | Full‑Stack Developer | Architecting Scalable Systems for Regulated Environments",
            "contact_links": [
                { "label": 'Email', "href": 'mailto:saesha.rutledge.dev@gmail.com' },
                { "label": 'GitHub', "href": 'https://github.com/saesharutledgedev-beep' },
                {
                    "label": 'LinkedIn',
                    "href": 'https://www.linkedin.com/in/saesha-rutledge-profile-link/',
                }
            ]
        }

    return jsonify(contacts)