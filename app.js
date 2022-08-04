const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const date = require(__dirname + '/date.js');
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
// Insert ejs in our express render engine
app.set('view engine', 'ejs');

let listItems = [];
let workListItems = [];
let ejsObject = {
    listTitle: '',
    items: []
};

// MONGOOSE SETUP
// --------------------------------------------------------
mongoose.connect('mongodb://localhost:27017/ToDoList_DB');
const listSchema = {
  _id: {
    type: Number,
    required: [true, 'ID should be given automatically as timeStamp at time of creation']
  },
  listItem: {
    type: String,
    required: [true, 'List Item should be inserted']
  },
};

const List = mongoose.model('List', listSchema);
const WorkList = mongoose.model('Worklist', listSchema);

app.get("/", (req, res) => {
    List.find({}, (err, foundItems) => {
        ejsObject.listTitle = date.getDate();
        ejsObject.items = foundItems;
        res.render('list', ejsObject);
    });    
});

app.get("/work", (req, res) => {
    WorkList.find({}, (err, foundWorkItems) => {
        ejsObject.listTitle = date.getDate()+'<br>Arbeitsliste';
        ejsObject.items = foundWorkItems;
        res.render('list', ejsObject);
    });   
});

app.get("/about", (req, res) => {
  res.render('about');
});

app.post("/", (req, res) => {

    if (req.body.listButton.includes('Arbeitsliste')) {
        const item = new WorkList(
            {
                _id: Date.now(),
                listItem: req.body.newItem
            }
        );
        WorkList.create(item);
        res.redirect("/work");
    } else {
        const item = new List(
            {
                _id: Date.now(),
                listItem: req.body.newItem
            }
        );
        List.create(item);
        res.redirect("/");
    }
});

app.post('/delete', (req, res) => {
    List.findByIdAndRemove(req.body.doneItem, (err) => {
        if (err) {
            console.log(err);
        } 
    });
    res.redirect('/');
});

app.listen(3000, () => {
  console.log('Server listens on Port 3000');
});