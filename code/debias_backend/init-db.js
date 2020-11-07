db = db.getSiblingDB("article_db");
db.article_tb.drop();
db.article_tb.createIndex({"url": 1}, {unique: true});