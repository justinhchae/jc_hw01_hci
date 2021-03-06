from flask import Response, request
from flask_restful import Resource
from mongoengine import DoesNotExist, Q
import models
import json

class CommentListEndpoint(Resource):

    def queryset_to_serialized_list(self, queryset):
        serialized_list = [
            item.to_dict() for item in queryset
        ]
        return serialized_list

    def get(self):
        post_id = request.args.get('post_id')
        keyword = request.args.get('keyword')
        if post_id:
            data = models.Comment.objects.filter(post=post_id)
        elif keyword:
            data = models.Comment.objects.filter(
            Q(comment__icontains=keyword) |
            Q(author__icontains=keyword)
            )
        else:
            data = models.Comment.objects
        # data = data.to_json()

        # formatting the output JSON
        data = self.queryset_to_serialized_list(data)
        return Response(json.dumps(data), mimetype="application/json", status=200)

    def post(self):
        """
        {
        "post": "60217e4c3e906827277708f0",
        "author": "test author",
        "comment": "test comment"
        }
        """
        body = request.get_json()
        comment = models.Comment(**body).save()
        serialized_data = {
            'id': str(comment.id),
            'message': 'Post {0} successfully created.'.format(comment.id)
        }
        return Response(json.dumps(serialized_data), mimetype="application/json", status=201)
        
class CommentDetailEndpoint(Resource):
    # def put(self, id):
    #     # TODO: implement PUT endpoint
    #     return Response(json.dumps([]), mimetype="application/json", status=200)
    def put(self, id):
        # body = request.get_json()
        comment = models.Comment.objects.get(id=id)
        request_data = request.get_json()
        comment.comment = request_data.get('comment')
        comment.author = request_data.get('author')
        comment.save()
        print(comment.to_json())
        return Response(comment.to_json(), mimetype="application/json", status=200)
    
    # def delete(self, id):
    #     # TODO: implement DELETE endpoint
    #     return Response(json.dumps([]), mimetype="application/json", status=200)
    def delete(self, id):
        comment = models.Comment.objects.get(id=id)
        comment.delete()
        serialized_data = {
            'message': 'Post {0} successfully deleted.'.format(id)
        }
        return Response(json.dumps(serialized_data), mimetype="application/json", status=200)

    # def get(self, id):
    #     # TODO: implement GET endpoint
    #     return Response(json.dumps([]), mimetype="application/json", status=200)
    def get(self, id):
        comment = models.Comment.objects.get(id=id)
        return Response(comment.to_json(), mimetype="application/json", status=200)

def initialize_routes(api):
    api.add_resource(CommentListEndpoint, '/api/comments', '/api/comments/')
    api.add_resource(CommentDetailEndpoint, '/api/comments/<id>', '/api/comments/<id>/')
    # api.add_resource(CommentListEndpoint, '/api/posts/<post_id>/comments', '/api/posts/<post_id>/comments/')
    # api.add_resource(CommentDetailEndpoint, '/api/posts/<post_id>/comments/<id>', '/api/posts/<post_id>/comments/<id>/')