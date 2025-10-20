from pydantic import BaseModel

class UserAction(BaseModel):
    user_id: str
    article_id: str
    title: str
    description: str
    url: str
    image: str
    liked: bool = False
    disliked: bool = False
    bookmarked: bool = False
    read: bool = False


