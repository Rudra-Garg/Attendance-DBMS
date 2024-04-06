from app import *


def create_app():
    app = Flask(__name__) 
    app.register_blueprint(student_bp)
    app.register_blueprint(faculty_bp)
    app.register_blueprint(login_bp)
    return app


app = create_app()


@app.route('/')
def login_page():
    return render_template('login.html')


if __name__ == "__main__":
    app.run(debug=True)
