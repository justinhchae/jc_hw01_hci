'''
To run on command line:
export FLASK_APP=app.py
export FLASK_ENV=development
flask run
'''
from flask_restful import Api
from flask import Flask, request, Response
from flask_cors import CORS
from flask import render_template
from decouple import config
import db
from views import posts, comments

from dotenv import load_dotenv
load_dotenv()
import os
app = Flask(__name__)
CORS(app)
db.init_database_connection(app)
api = Api(app)

# connect your routes to your app:
# @app.route('/')
# def home_page():
#     return 'This is your API Homepage'

## for user management, change render_template

"""
def list_posts():
    token_from_auth0 = request.args.get('token')
    real_token = os.environ.get('TOKEN')
    if token_from_auth0 == real_token:
        return render_template('get-posts.html', logged_in=True)
    else:
        return render_template('get-posts.html', logged_in=False)

"""

@app.route('/')
def list_posts():
    return render_template('get-posts.html')


@app.route('/add-post/')
def create_post():
    return render_template('create-post.html')

@app.route('/post/')
def get_single_post():
    return render_template('post-detail.html')


# routes from other files:
posts.initialize_routes(api)
comments.initialize_routes(api)


if __name__ == "__main__":
    print('running!')
    app.run(debug=True)