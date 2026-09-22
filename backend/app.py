from flask import Flask
from flask_cors import CORS

from routes.about import about_bp

from routes.hero import hero_bp

from routes.experience import experience_info_bp

from routes.education import education_info_bp

from routes.skills import skills_bp

from routes.projects import projects_bp

from routes.contacts import contacts_bp


app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])
app.register_blueprint(about_bp)
app.register_blueprint(hero_bp)
app.register_blueprint(experience_info_bp)
app.register_blueprint(education_info_bp)
app.register_blueprint(skills_bp)
app.register_blueprint(projects_bp)
app.register_blueprint(contacts_bp)  


@app.route("/")
def index():
    return "Backend is running."

if __name__ == "__main__":
    app.run(debug=True, port=5000)
