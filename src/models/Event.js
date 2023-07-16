export function Event(id, title, content, userJoins, time, location) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.userJoins = userJoins;
    this.time = time;
    this.location = location;
    this.lock = false;
}

export function Time(start, end) {
    this.timeStart = start;
    this.timeEnd = end;
}
