from fastapi import APIRouter
from app.models import UserAction
from app.database import db

router = APIRouter(prefix="/user", tags=["user"])

@router.post("/action")
def store_user_action(action: UserAction):
    """Store or update user's action for an article."""
    doc_ref = db.collection("user_actions").document(f"{action.user_id}_{action.article_id}")
    doc_ref.set({
        "user_id": action.user_id,
        "article_id": action.article_id,
        "liked": action.liked,
        "disliked": action.disliked,
        "bookmarked": action.bookmarked
    })
    return {"status": "success"}

@router.get("/actions/{user_id}")
def get_user_actions(user_id: str):
    """Retrieve all actions for a user."""
    actions_ref = db.collection("user_actions").where("user_id", "==", user_id)
    docs = actions_ref.stream()
    result = []
    for doc in docs:
        result.append(doc.to_dict())
    return result
