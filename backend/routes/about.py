from flask import Blueprint, jsonify

about_bp = Blueprint("about", __name__, url_prefix="/api/about")


@about_bp.route("")
def get_about():
    about = {
            "id": 1,
            "name": "About",
            "titles": [
                "AI‑Forward Product Manager",
                "Full‑Stack Developer",
                "Architecting Scalable Systems",
            ]
        }
    return jsonify(about)