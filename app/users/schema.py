from django.contrib.auth import get_user_model
import graphene
from graphene_django import DjangoObjectType


class UserType(DjangoObjectType):
    class Meta:
        model = get_user_model()
        only_fields = ('id', 'email', 'password', 'username', 'like_set', 'track_set')


class Query(graphene.ObjectType):
    user = graphene.Field(UserType, id=graphene.Int(required=True))
    users = graphene.List(UserType)
    me = graphene.Field(UserType)

    def resolve_user(self, info, id):
        return get_user_model().objects.get(id=id)

    def resolve_me(self, info):
        user = info.context.user
        if user.is_anonymous:
            raise Exception("not logged in!")

        return user

    def resolve_users(self, info):
        users = get_user_model().objects.all()
        return users


class CreateUser(graphene.Mutation):
    user = graphene.Field(UserType)

    class Arguments:
        username = graphene.String(required=True)
        password = graphene.String(required=True)
        email = graphene.String(required=True)

    def mutate(self, info, username, password, email):
        user = get_user_model()(username=username, email=email)
        user.set_password(password)
        user.save()
        return CreateUser(user=user)


class Mutation(graphene.ObjectType):
    create_user = CreateUser.Field()
