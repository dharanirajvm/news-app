from fastapi import APIRouter
from app.models import UserAction
from app.database import db
from typing import Optional

router = APIRouter(prefix="/user", tags=["user"])

@router.post("/action")
def store_user_action(action: UserAction):
    """Store or update user's action for an article and update stats."""

    user_doc_ref = db.collection("users").document(action.user_id)
    action_doc_ref = user_doc_ref.collection("actions").document(action.article_id)
    stats_doc_ref = user_doc_ref.collection("stats").document("counts")

    # Store/Update main action info
    action_data = {
        "article_id": action.article_id,
        "liked": action.liked,
        "disliked": action.disliked,
        "bookmarked": action.bookmarked,
        "read": action.read,
        "title": getattr(action, "title", None),
        "description": getattr(action, "description", None),
        "url": getattr(action, "url", None),
        "image": getattr(action, "image", None),
        "category": getattr(action, "category", None)
    }
    action_doc_ref.set(action_data, merge=True)

    # Update Stats
    stats_doc = stats_doc_ref.get()
    stats_data = stats_doc.to_dict() if stats_doc.exists else {
        "likes_count": 0,
        "bookmarks_count": 0,
        "read_count": 0
    }

    if action.liked:
        stats_data["likes_count"] += 1
    if action.bookmarked:
        stats_data["bookmarks_count"] += 1
    if action.read:
        stats_data["read_count"] += 1

    stats_doc_ref.set(stats_data, merge=True)

    # Maintain dedicated collections for liked/bookmarked posts
    if action.liked:
        user_doc_ref.collection("liked_posts").document(action.article_id).set(action_data, merge=True)
    elif not action.liked:
        # remove from liked if unliked
        user_doc_ref.collection("liked_posts").document(action.article_id).delete()

    if action.bookmarked:
        user_doc_ref.collection("bookmarked_posts").document(action.article_id).set(action_data, merge=True)
    elif not action.bookmarked:
        # remove from bookmarks if unbookmarked
        user_doc_ref.collection("bookmarked_posts").document(action.article_id).delete()

    return {"status": "success", "message": "Action stored successfully."}


@router.get("/actions/{user_id}")
def get_user_actions(user_id: str):
    """Retrieve all actions for a user."""
    actions_ref = db.collection("users").document(user_id).collection("actions")
    docs = actions_ref.stream()
    result = [doc.to_dict() for doc in docs]
    return result


@router.get("/liked/{user_id}")
def get_liked_posts(user_id: str):
    """Retrieve all liked posts for a user."""
    liked_ref = db.collection("users").document(user_id).collection("liked_posts")
    docs = liked_ref.stream()
    return [doc.to_dict() for doc in docs]


@router.get("/bookmarked/{user_id}")
def get_bookmarked_posts(user_id: str):
    """Retrieve all bookmarked posts for a user."""
    bookmarked_ref = db.collection("users").document(user_id).collection("bookmarked_posts")
    docs = bookmarked_ref.stream()
    return [doc.to_dict() for doc in docs]


@router.get("/stats/{user_id}")
def get_user_stats(user_id: str):
    """Retrieve user stats (like/bookmark/read counts)."""
    stats_ref = db.collection("users").document(user_id).collection("stats").document("counts")
    doc = stats_ref.get()
    if doc.exists:
        return doc.to_dict()
    return {"likes_count": 0, "bookmarks_count": 0, "read_count": 0}
