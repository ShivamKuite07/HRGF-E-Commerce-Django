from rest_framework import permissions

class IsOwnerOrAdminOrReadOnly(permissions.BasePermission):
    """
    - SAFE methods (GET, HEAD, OPTIONS): allowed for anyone
    - Unsafe methods (PUT, DELETE): only creator or admin
    """

    def has_object_permission(self, request, view, obj):
        # Read-only: allow for everyone
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write/delete: only if user is owner or admin
        return obj.created_by == request.user or request.user.is_staff
