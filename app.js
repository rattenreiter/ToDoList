const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const date = require(__dirname + '/date.js');
const app = express();

app.use(bodyParser.urlencoded({  extended: true }));
app.use(express.static('public'));
// Insert ejs in our express render engine
app.set('view engine', 'ejs');

let listItems = [];
let workListItems = [];
let ejsObject = {
    listTitle: '',
    items: []
};

    app.get("/", (req, res) => {
        ejsObject.listTitle = date.getDate();
        ejsObject.items = listItems;
        res.render('list', ejsObject);
    });

    app.get("/work", (req, res) => {
        ejsObject.listTitle = date.getDate();
        ejsObject.listTitle += '<br>Arbeitsliste';
        ejsObject.items = workListItems;
        res.render('list', ejsObject);
    });

    app.get("/about", (req, res) => {
        res.render('about');
    });

    app.post("/", (req, res) => {

        if (req.body.listButton.includes('Arbeitsliste')) {
            workListItems.push(req.body.newItem);
            res.redirect("/work");
        } else {
            listItems.push(req.body.newItem);
            res.redirect("/");
        }
        // itemString = '<div class="item"><input type="checkbox"><p>';
        // itemString += req.body.newItem;
        // itemString += '</p></div>';
        // listItems.push(itemString);
        // ejsObject.items = listItems.join(""); 
    });

app.listen(3000, () => {
    console.log('Server listens on Port 3000');
});