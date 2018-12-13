# MeetBot
## 概要
MeetBotは、Slack向けのミーティング用Botです。  
以下の設定が可能です。  
・ミーティング参加者の設定  
・各メンバーへの質問内容の設定  
・各メンバーの回答内容を投稿するチャンネルの設定  
・ミーティング開始時間の設定

現状、1件のミーティングにしか対応していません。

## システム構成
システム構成は以下のようになっています。
![meetbot](https://user-images.githubusercontent.com/19472713/49911180-c2357e00-fec8-11e8-9c2e-3173227e9205.png)

Botは、Lambdaで実装しており、Botの設定画面をS3に静的ホスティングで配置しています。

※設定画面は必ずしもS3に配置する必要はありません。  
S3に配置する場合は、AWSのアクセスキーIDやシークレットアクセスキーが見えてしまう状態となるため、IPアドレス制限を行うなどの対応をしてください。

# 開発環境
以下の環境で開発しています。

| 項目 | バージョン |
----|---- 
| Python | 3.6 |
| create-react-app | 1.5.2 |

# 環境構築
## create-react-appのインストール
create-react-appをインストールする必要があります。
```
npm i -g create-react-app
```

frontendフォルダに移動して、以下を実行してください。
```
npm install
```
## SlackにBotを作成する
以下のURLにアクセスし、Slackアプリケーションを作成します。  
https://api.slack.com/apps

## Frontendの環境変数の設定
frontendフォルダ直下に、.envファイルを作成します。  
以下を参考にして、各項目の値を定義をしてください。

```
REACT_APP_AWS_REGION='ap-northeast-1'
REACT_APP_AWS_ACCESS_KEY_ID='ABCDEFG'
REACT_APP_AWS_SECRET_ACCESS_KEY='HIJKLMN'
REACT_APP_SLACK_TOKEN='OPQRSTU'
```

上記の定義は、それぞれ以下の内容です。

| 項目 | 内容 |
----|---- 
| REACT_APP_AWS_REGION | AWSのリージョン |
| REACT_APP_AWS_ACCESS_KEY_ID | AWSのアクセスキーID |
| REACT_APP_AWS_SECRET_ACCESS_KEY | AWSのシークレットアクセスキー |
| REACT_APP_SLACK_TOKEN | SlackのBot User OAuth Access Token |

## Botのセットアップ用ファイルの設定
プロジェクトのルートフォルダのsetup.ymlを編集します。
以下のキーワードの部分を環境に合わせて変更してください。

```
SLACK_BOT_USER_ACCESS_TOKEN: xoxb-abcde
SLACK_BOT_VERIFY_TOKEN: fghijklmn
aws:SourceIp: 
  - "111.222.333.444/32"
```

| 項目 | 内容 |
----|---- 
| SLACK_BOT_USER_ACCESS_TOKEN | SlackのBot User OAuth Access Token |
| SLACK_BOT_VERIFY_TOKEN | SlackのVerification Token |
| aws:SourceIp | S3に配置する設定画面へのアクセスを許可するIPアドレス |


# リリース
(1)S3にmeetbot-botというBucketを作成します。

(2)botディレクトリ内のファイル一式をsrc.zipとして作成後、(1)で作成したbucketにアップロードします。  

(3)AWSのCloudFormationを使用して、setup.ymlを実行します。

(4)frontendフォルダに移動して、以下を実行します。
```
npm run build
```

(5)S3に(3)でmeetbot-frontというBucketが作成されているので、buildフォルダに作成されたファイル一式をアップロードします。
