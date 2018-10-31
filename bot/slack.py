import os
import json
import urllib.request


def get_users_info(user):
    url = "https://slack.com/api/users.info"

    params = {
        "token": os.environ["SLACK_BOT_USER_ACCESS_TOKEN"],
        "user": user
    }

    req = urllib.request.Request('{}?{}'.format(url, urllib.parse.urlencode(params)))
    res = urllib.request.urlopen(req).read().decode("utf-8")

    return json.loads(res)
    

def post_broadcast_message(channel, message, display_name, icon, attachments):
    url = "https://slack.com/api/chat.postMessage"
    headers = {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer {0}'.format(os.environ["SLACK_BOT_USER_ACCESS_TOKEN"])
    }
    data = {
        "token": os.environ["SLACK_BOT_VERIFY_TOKEN"],
        "channel": channel,
        "text": message,
        "username": display_name,
        "icon_url": icon,
        "attachments": attachments
    }
    
    req = urllib.request.Request(url, data=json.dumps(data).encode("utf-8"), method="POST", headers=headers)
    res = urllib.request.urlopen(req)
    

def post_message(channel, message, attachments=[]):
    url = "https://slack.com/api/chat.postMessage"
    headers = {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer {0}'.format(os.environ["SLACK_BOT_USER_ACCESS_TOKEN"])
    }
    data = {
        "token": os.environ["SLACK_BOT_VERIFY_TOKEN"],
        "channel": channel,
        "text": message,
        "attachments": attachments
    }

    req = urllib.request.Request(url, data=json.dumps(data).encode("utf-8"), method="POST", headers=headers)
    urllib.request.urlopen(req)

