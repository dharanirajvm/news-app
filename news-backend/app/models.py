from pydantic import BaseModel

class UserAction(BaseModel):
    user_id: str
    article_id: str
    liked: bool = False
    disliked: bool = False
    bookmarked: bool = False
