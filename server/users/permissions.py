from rest_framework import permissions

class IsSelf(permissions.BasePermission):
    """
    Only allow users to access/modify their own user object.
    Useful on object-level views where the object is a User instance.
    """

    def has_object_permission(self, request, view, obj):
        # obj is expected to be a User instance
        return obj == request.user
