import graphene
from graphene_django import DjangoObjectType

from .models import Track, Like
from users.schema import UserType
from django.db.models import Q


class TrackType(DjangoObjectType):
    class Meta:
        model = Track


class LikeType(DjangoObjectType):
    class Meta:
        model = Like


class Query(graphene.ObjectType):
    tracks = graphene.List(TrackType, search=graphene.String(), limit=graphene.Int())
    like = graphene.List(LikeType)

    def resolve_tracks(self, info, search=None, limit=None):
        if search:
            filter = (
                Q(title__icontains=search) |
                Q(description__icontains=search) |
                Q(url__icontains=search) |
                Q(posted_by__username__icontains=search)
            )
            return Track.objects.filter(filter)

        track = Track.objects.all()
        print(track)
        return Track.objects.all()

    def resolve_like(self, info):
        return Like.objects.all()


class CreateTrack(graphene.Mutation):
    track = graphene.Field(TrackType)

    class Arguments:
        title = graphene.String()
        description = graphene.String()
        url = graphene.String()

    def mutate(self, info, title, description, url):
        user = info.context.user

        if user.is_anonymous:
            raise Exception("you must log in")

        track = Track(title=title, description=description, url=url, posted_by=user)
        track.save()
        return CreateTrack(track=track)


class UpdateTrack(graphene.Mutation):
    track = graphene.Field(TrackType)

    class Arguments:
        track_id = graphene.ID(required=True)
        title = graphene.String()
        description = graphene.String()
        url = graphene.String()

    def mutate(self, info, track_id, title, url=None, description=None):
        user = info.context.user
        track = Track.objects.get(id=track_id)

        if track.posted_by != user:
            raise Exception("Not permitted to update this track.")

        if title:
            track.title = title

        if description:
            track.description = description

        if url:
            track.url = url
        track.save()
        return UpdateTrack(track=track)


class DeleteTrack(graphene.Mutation):
    track_id = graphene.Int()

    class Arguments:
        track_id = graphene.Int(required=True)

    def mutate(self, info, track_id):
        user = info.context.user
        track = Track.objects.get(id=track_id)
        if user != track.posted_by:
            raise Exception("You must login for delete this track")

        track.delete()
        return DeleteTrack(track_id=track_id)


class CreateLike(graphene.Mutation):
    user = graphene.Field(UserType)
    track = graphene.Field(TrackType)

    class Arguments:
        track_id = graphene.Int(required=True)

    def mutate(self, info, track_id):
        user = info.context.user
        if user.is_anonymous:
            raise Exception("Login to like tracks")

        track = Track.objects.get(id=track_id)
        if not track:
            raise Exception("Cant find with given track id")

        Like.objects.create(track=track, user=user)

        return CreateLike(user=user, track=track)


class Mutation(graphene.ObjectType):
    create_track = CreateTrack.Field()
    update_track = UpdateTrack.Field()
    delete_track = DeleteTrack.Field()
    create_like = CreateLike.Field()
