import os


def create_message(datas, settings):

    messages = []
    
    for value in datas:
        index = int(value.get('question_no')) - 1

        data = {
            "color": settings.get_question_color(index),
            "title": settings.get_question_text(index),
            "text": value.get('text')
        }
        messages.append(data)

    return messages

def get_broadcast_message(title, username):
    return '*' + username + "*" + " posted an update for *" + title + "*"
