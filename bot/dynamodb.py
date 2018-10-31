import boto3
from boto3.dynamodb.conditions import Key, Attr


class DynamoDB:
    
    MESSAGE_TABLE = "meetbot_message"
    MESSAGE_SEQ_TABLE = "meetbot_message_sequence"

    def get_status(self, user):
        table = self.dynamodb.Table(DynamoDB.MESSAGE_SEQ_TABLE)
        response = table.get_item(
            Key={
                'user': user
            },
            ConsistentRead=True
            )
            
        return response.get('Item')

    def get_statusAll(self):
        table = self.dynamodb.Table(DynamoDB.MESSAGE_SEQ_TABLE)
        response = table.scan(
            ConsistentRead=True,
        )
        
        return response.get('Items')


    def save_status(self, user, question_no):
        table = self.dynamodb.Table(DynamoDB.MESSAGE_SEQ_TABLE)
        table.put_item(
            Item={
                'user': user,
                'question_no': question_no,
           }
        )

    def delete_status(self, user):
        table = self.dynamodb.Table(DynamoDB.MESSAGE_SEQ_TABLE)
        table.delete_item(
            Key={
                'user': user,
            }
        )


    def get_message(self, user, question_no):
        table = self.dynamodb.Table(DynamoDB.MESSAGE_TABLE)
        response = table.get_item(
            Key={
                'user': user,
                'question_no': question_no
            },
            ConsistentRead=True
            )
            
        return response.get('Item')
        
    def get_messages(self, user):
        table = self.dynamodb.Table(DynamoDB.MESSAGE_TABLE)
        response = table.query(
            ConsistentRead=True,
            KeyConditionExpression=Key('user').eq(user)
        )
        
        return response.get('Items')

    def get_messageAll(self):
        table = self.dynamodb.Table(DynamoDB.MESSAGE_TABLE)
        response = table.scan(
            ConsistentRead=True,
        )
        
        return response.get('Items')

        
    def save_message(self, user, question_no, text):
        table = self.dynamodb.Table(DynamoDB.MESSAGE_TABLE)
        table.put_item(
            Item={
                'user': user,
                'question_no': question_no,
                'text': text
           }
        )

    def delete_message(self, user, question_no):
        table = self.dynamodb.Table(DynamoDB.MESSAGE_TABLE)
        table.delete_item(
            Key={
                'user': user,
                'question_no': question_no,
            }
        )
        
    def __init__(self):
        self.dynamodb = boto3.resource('dynamodb')