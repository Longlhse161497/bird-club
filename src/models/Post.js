export function Post(id, title, content, tags, view, reactions, images, userId) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.tags = tags;
    this.view = view;
    this.reactions = reactions;
    this.verify = true;
    this.images = images;
    this.userId = userId;
    this.create_at = Date.now();
    this.comments = []
}

export function Reaction(type, userId) {
    this.type = type;
    this.userId = userId;
}

export function Comment(id, content, user, reactions) {
    this.id = id;
    this.content = content;
    this.user = user;
    this.reactions = reactions;
}