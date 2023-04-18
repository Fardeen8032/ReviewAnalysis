from flask import Flask, render_template,request, redirect,json;
import snscrape.modules.twitter as sntwitter
import pandas as pd
import snscrape.modules.twitter as sntwitter
import pandas as pd
from textblob import TextBlob
import re
import string
import sqlite3
import os
from os import path
import pickle

model = pickle.load(open('spam_classifier.pkl', 'rb'))
cv = pickle.load(open('cv.pkl', 'rb'))

app = Flask(__name__)
currentdirectory = os.path.dirname(os.path.abspath(__file__))
db_path = path.join(currentdirectory, 'userreview.db')

@app.route("/", methods = ["GET","POST"])
def index():
    if request.method == 'POST':
        try:
            username = request.form['username']
            email = request.form['email']
            password = request.form['password']

            con = sqlite3.connect(db_path)


            cur  = con.cursor()
            cur.execute("INSERT INTO user (username, email, password) VALUES (?,?,?)",(username, email, password))
            con.commit()

            return redirect("/Login")
        except Exception as e:
            print(f"error in insertion: {e}")
            con.rollback()



    return render_template('index.html')

@app.route("/Home", methods=["GET","POST"])
def Home():

    return render_template("Home.html")

@app.route("/Login",methods = ["GET","POST"])
def Login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        try:
            con = sqlite3.connect(db_path)
            cur = con.cursor()
            cur.execute("SELECT * FROM user WHERE username=? AND password=?", (username, password))
            user = cur.fetchone()

            if user:

                return redirect('/Home')
            else:
                return render_template('Login.html', error = 'Invalid credentials')
        except Exception as e:
            print(f"Error during login: {e}")


    return render_template('Login.html')

@app.route("/Spam", methods = ["GET","POST"])
def Spam():
    if request.method == "POST":
        text = request.form["text"]
        Text = request.form["Text"]


        data = [Text]
        vectorizer = cv.transform(data).toarray()
        prediction = model.predict(vectorizer)
        if prediction:
            return render_template("Spam.html", prediction = 'The review is spam')
        else:
            return render_template("Spam.html", prediction = 'The review is not spam')
    return render_template('Spam.html')

@app.route("/Phrase",methods = ["GET","POST"])
def Phrase():
    return render_template('Phrase.html')



@app.route("/dashboard", methods = ["GET","POST"])
def dashboard():

        if request.method=="POST":
            name = request.form['name']
            num = int(request.form['num'])


        # Creating list to append tweet data to
        tweets_list2 = []
        Tweets = []
        # Using TwitterSearchScraper to scrape data and append tweets to list
        scraper = sntwitter.TwitterSearchScraper(name)
        scraperdate = sntwitter.TwitterSearchScraper('since:2022-06-09 until:2022-11-19')
        for i,tweet in enumerate(scraper.get_items()):
            if i>=num:
                break
            tweets_list2.append([tweet.user.username, tweet.content, tweet.date])
            Tweets.append({"username":tweet.user.username,"Likes":tweet.likeCount})
        # Creating a dataframe from the tweets list above
        data = pd.DataFrame(tweets_list2, columns=['Username',  'Text', 'Datetime'])
        con = sqlite3.connect(db_path)
        cur  = con.cursor()
        for tweet in tweets_list2:
                username = tweet[0]
                content = tweet[1]
                date = tweet[2]
                cur.execute("INSERT INTO tweets (username, content, date, name) VALUES (?, ?, ?, ?)", (username, content, date, name))





        con.commit()
        f = open("tweets.json","w")
        j= json.dumps(Tweets)
        f.write(j)
        f.close()









        cur.execute("SELECT username, content, date FROM tweets WHERE name=?", (name,))
        data = cur.fetchall()
        con.close()
        def cleantweets(newtweet):
            newtweet = str(newtweet)
            newtweet = newtweet.lower();
            newtweet = re.sub('\[.*?]','', newtweet)
            newtweet = re.sub('[%s]' % re.escape(string.punctuation), '', newtweet)
            newtweet = re.sub('\w*\d\w', '', newtweet)
            newtweet = newtweet.replace('RT', '')
            if newtweet.startswith(' @'):
                position = newtweet.index(':')
                newtweet = newtweet[position+2:]
            if newtweet.startswith('@'):
                position = newtweet.index(' ')
                newtweet = newtweet[position+2:]
            return newtweet;

        total = 0
        polarity = 0
        positive = 0
        negative = 0
        neutral = 0


        for newtweet in data:
            clean = cleantweets(newtweet);
            analysis = TextBlob(clean)
            tweet_polarity = analysis.polarity
            if tweet_polarity > 0.00:
                positive+= 1
                sentiment = "positive"
            elif tweet_polarity < 0.00:
                negative+= 1
                sentiment = "negative"
            elif tweet_polarity == 0.00:
                neutral+=1



        temp = data


        return render_template('Sentence.html' ,Total = num ,Positive = positive, Negative = negative,Neutral=neutral,records=temp)








if __name__=='__main__':
    app.run(debug=True);


