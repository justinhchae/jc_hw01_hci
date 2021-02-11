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
<<<<<<< HEAD
#from decouple import config
=======

>>>>>>> 5be426c4c9f63a75fd46962a7dd78ff0b2786368
import db
from views import posts, comments

from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)
CORS(app)
db.init_database_connection(app)
api = Api(app)

# connect your routes to your app:
# @app.route('/')
# def home_page():
#     return 'This is your API Homepage'

<<<<<<< HEAD
## for user management, change render_template


@app.route('/')
def list_posts():
<<<<<<< HEAD
    # token_from_auth0 = request.args.get('token')
    # token_from_auth0 = '1234'
    # real_token = config('AUTH0_TEST')
    #
    # if token_from_auth0 == real_token:
    #     return render_template('get-posts.html', logged_in=True)
    # else:
    #     return render_template('get-posts.html', logged_in=False)
=======
>>>>>>> 5be426c4c9f63a75fd46962a7dd78ff0b2786368
    return render_template('get-posts.html')

=======
@app.route('/')
def list_posts():
    return render_template('get-posts.html')
>>>>>>> parent of d797f98 (update blog post methods)

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