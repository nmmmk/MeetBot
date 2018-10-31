import os
import json
import logging
import slack
import messages
from dynamodb import DynamoDB
from settings import Settings
from enum import Enum

# ログ設定
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# イベント種別
class EventType(Enum):
    CLOUD_WATCH = 1
    S3_UPLOADED = 2
    SLACK = 3
    

def handle_event(event, context):
    """イベントハンドラ
    
    :param event: イベントデータ
    :param context: ランタイム情報
    
    :return: OK文字列
    """
	
	# 受け取ったイベント情報をCloud Watchログに出力
    logging.info(json.dumps(event))

    # SlackのEvent APIの認証
    if "challenge" in event:
        return event["challenge"]
    
    # DynamoDBクラス生成
    dynamodb = DynamoDB()

    # Settingsクラス生成
    settings = Settings()
    isLoad = settings.load()
    if isLoad == False:
        return "OK"
    
    # イベント種別取得
    eventType = get_event_type(event)

    # スケジュール起動(ミーティング開始)の
    if eventType == EventType.CLOUD_WATCH:
        # ミーティング開始
        start_meeting(settings, dynamodb)
        
    # S3に設定ファイルがアップロードされた
    elif eventType == EventType.S3_UPLOADED:
        # DBの情報をリセット
        resetDB(settings, dynamodb)
        
    # Slack関連イベント    
    else:
        # ミーティング処理
        meeting_proc(event, settings, dynamodb)

    return "OK"


def get_event_type(event):
    """イベント種別取得
    
    :param event: イベントデータ

    :return: イベント種別
    """
    
    type = EventType.SLACK
    
    if event.get("meeting") == "start":
        type = EventType.CLOUD_WATCH
    elif "Records" in event:
        if event.get("Records")[0].get("s3").get("bucket").get("name") == "meetbot":
            type = EventType.S3_UPLOADED
    
    return type


def meeting_proc(event, settings, dynamodb):
    """ミーティング処理
    
    :param event: イベントデータ
    :param settings: Settingsクラスオブジェクト
    :param dynamodb: DynamoDBクラスオブジェクト

    :return: なし
    """    
    
    # tokenのチェック
    if not is_verify_token(event):
        return

    # 新規投稿であるかをチェック（削除や編集は対象外）
    if not is_new_message(event):
        return

    # slackのイベント
    slack_event = event["event"]

    # ユーザー
    userid = slack_event["user"]
    
    # テキスト
    text = slack_event["text"]
    
    # チャンネル
    channel = slack_event["channel"]

    # ユーザーが存在するかをチェック
    isuser = settings.is_user(userid)
    if isuser == False:
        return

    # ステータス取得
    status = dynamodb.get_status(userid)

    # Question number
    question_no = status['question_no']

    # ミーティング時間外
    if question_no == 0:
        return

    # メッセージを保存
    dynamodb.save_message(userid, question_no, text)

    # 最後の質問への回答の場合
    question_len = len(settings.get_question_list())
    if question_no == question_len:
        # 完了メッセージを送信
        slack.post_message(channel, settings.get_end_message())

        # 収集されたメッセージを全て取得
        d = dynamodb.get_messages(userid)

        # メッセージを作成
        attachments = messages.create_message(d, settings)
        
        # get_users_infoでユーザー名やアイコンを取得
        profile = slack.get_users_info(userid).get('user').get('profile')
        
        # 投稿先チャンネル
        broadcast_channel = settings.get_broadcast_channel()

        # メッセージ
        message = messages.get_broadcast_message(settings.get_project_title(), profile['real_name'])

        # 該当チャンネルに、投稿内容をまとめて送信
        slack.post_broadcast_message(broadcast_channel, message, profile['display_name'], profile['image_48'], attachments)

        # Question numberを0にする(ミーティング終了)
        dynamodb.save_status(userid, 0)
        
        # メッセージを全て削除する
        for num in range(1, question_len + 1):
            dynamodb.delete_message(userid, num)
    
    # 回答中の場合
    else:
        # Question numberを1つ進める
        dynamodb.save_status(userid, question_no + 1)

        # Slackにメッセージを投稿する
        slack.post_message(channel, settings.get_question_text(int(question_no)))    


def resetDB(settings, dynamodb):
    """DBの情報をリセット
    
    :param settings: Settingsクラスオブジェクト
    :param dynamodb: DynamoDBクラスオブジェクト
    
    :return: なし
    """
    
    # messageを全て削除する
    message= dynamodb.get_messageAll()
    for data in message:
        dynamodb.delete_message(data.get('user'), data.get('question_no'))
    
    # ユーザーのステータスを削除する
    status = dynamodb.get_statusAll()
    for data in status:
        dynamodb.delete_status(data.get('user'))
    
    # ユーザー一覧を取得
    users = settings.get_users()
    
    # ユーザーが0人の場合
    if len(users) == 0:
        return

    # 一人ずつステータスをクリアする
    for user in users:
        # ユーザーIDを取得
        userId = user['id']
        
        # DBからDM IDを取得
        dmid = user['dmid']
        
        # Question number = 0にする
        dynamodb.save_status(userId, 0)

def start_meeting(settings, dynamodb):
    """ミーティング開始処理
    
    :param settings: Settingsクラスオブジェクト
    :param dynamodb: DynamoDBクラスオブジェクト
    
    :return: なし
    """

    # ユーザー一覧を取得
    users = settings.get_users()
    
    # ユーザーが0人の場合
    if len(users) == 0:
        return

    # 一人ずつミーティング開始メッセージを送信する
    for user in users:
        # ユーザーIDを取得
        userId = user['id']
        
        # DBからDM IDを取得
        dmid = user['dmid']
        
        # Question number = 1にする(ミーティング開始)
        dynamodb.save_status(userId, 1)
        
        # 1つ目の質問を送信する
        message = settings.get_start_message() + "\n" + settings.get_question_text(0)
        slack.post_message(dmid, message)


def is_verify_token(event):
    """BotのVerify Tokenのチェック
    
    :param event: イベントデータ
    
    :return: [True] チェックOK, [False] チェックNG
    """

    # トークンをチェック    
    token = event.get("token")
    if token != os.environ["SLACK_BOT_VERIFY_TOKEN"]:
        return False

    return True
    
def is_new_message(event):
    """Botからのメッセージが新規メッセージであるかをチェック
    
    :param event: イベントデータ
    
    :return: [True] チェックOK, [False] チェックNG
    """

    # eventの有無をチェック
    eve = event.get("event")
    if eve is None:
        return False
        
    # typeのチェック
    type = eve.get("type")
    if type != "message":
        return False
    
    # subtypeのチェック(subtypeがある場合は、NG)
    # 新規投稿だけを対象にする
    subtype = eve.get("subtype")
    if subtype is not None:
        return False
    
    return True

