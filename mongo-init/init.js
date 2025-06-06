db=db.getSiblingDB(process.env.MONGO_NAME);
db.createCollection("Users");
db.createCollection("Boosters");
db.createCollection("Exchanges");

db.Boosters.insertMany([
    {
        "boosterName": "Small",
        "price": 6,
        "cardNumber":4,
        "img":"",
        "type":"default"
    },
    {
        "boosterName": "Medium",
        "price": 8,
        "cardNumber":6,
        "img":"",
        "type":"default"
    },
    {
        "boosterName": "Large",
        "price": 10,
        "cardNumber":15,
        "img":"",
        "type":"default"
    }

])