import os
import json
import boto3


class Settings:
    def load(self):
        isLoad = True
        try:
            object = self.s3.get_object(Bucket='meetbot', Key='settings.json')['Body'].read().decode('utf-8')
            self.param = json.loads(object)
        except:
            isLoad = False
    
        return isLoad

    def get_project_title(self):
        return self.param['project']['name']


    def get_start_message(self):
        return self.param['project']['startMessage']


    def get_end_message(self):
        return self.param['project']['endMessage']


    def get_question_list(self):
        return self.param['questions']


    def get_question_color(self, index):
        return self.param['questions'][index]['color']


    def get_question_text(self, index):
        return self.param['questions'][index]['text']


    def get_users(self):
        return self.param['user']


    def is_user(self, userid):
        for user in self.get_users():
            if user['id'] == userid:
                return True

        return False


    def get_broadcast_channel(self):
        return self.param['broadcastCh']


    def __init__(self):
        self.s3 = boto3.client('s3')
        self.param = None
