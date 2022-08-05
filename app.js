const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const _ = require('lodash');
const date = require(__dirname + '/date.js');
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
// Insert ejs in our express render engine
app.set('view engine', 'ejs');

let listItems = [];
let workListItems = [];
let newListName ='';
let ejsObject = {
    listTitle: '',
    items: [],
    listLink: '',
    lists: []
};

// MONGOOSE SETUP
// --------------------------------------------------------
mongoose.connect('mongodb://localhost:27017/ToDoList_DB');
const itemSchema = new mongoose.Schema({
  _id: Number,
  listItem: String,
});

const listSchema = new mongoose.Schema({
    _id: {
      type: Number,
      required: [true, 'ID should be given automatically as timeStamp at time of creation']
    },
    listName: {
        type: String,
        required: [true,'']
    },
    listItems: [itemSchema],
    listLink: String
  });

const Item = mongoose.model('Item', itemSchema);
const List = mongoose.model('List', listSchema);

app.get("/", (req, res) => {
    Item.find({}, (err, foundItems) => {
        ejsObject.listTitle = date.getDate();
        ejsObject.items = foundItems;
        ejsObject.listLink = '';
        List.find({}, (err, foundLists) => {
            ejsObject.lists = foundLists;
        });
        res.render('list', ejsObject);
    });    
});

app.get("/:customListName", (req, res) => {
    const customList = _.capitalize(req.params.customListName);
    List.findOne({listName: customList}, (err, foundList) => {
        if (!err) {
            if (!foundList) {
                const list = new List({
                    _id: Date.now(),
                    listName: customList,
                    listLink: customList
                });
                list.save();
                res.redirect("/" + customList);
            } else {
                ejsObject.listTitle = date.getDate();
                ejsObject.listTitle += '<br>' + foundList.listName;
                ejsObject.items = foundList.listItems;
                ejsObject.listLink = foundList.listName;
                List.find({}, (err, foundLists) => {
                    ejsObject.lists = foundLists;
                });
                res.render("list", ejsObject);
            }
        }
    });
    const list = new List({
        _id: Date.now(),
        listName: customList,
    });
    

});

app.get("/about", (req, res) => {
  res.render('about');
});

app.post("/", (req, res) => {

        const itemName = req.body.newItem;
        const listName = req.body.listButton;
        const newList = req.body.newList;
        const newListButton = req.body.newListButton;

        if (newList) {
            res.redirect('/' + newList);
        } else if (newListButton && !newList) {
            res.redirect('/');
        } else {
            if (itemName) {
                const item = new Item({
                    _id: Date.now(),
                    listItem: itemName
                });

                if (listName === '') {
                    item.save();
                    res.redirect('/');
                } else {
                    List.findOne({listName: listName}, (err, foundList) => {
                        if (!err) {
                            foundList.listItems.push(item);
                            foundList.save();
                        }
                    });
                    
                } 
            }
            res.redirect('/' + listName);
        }
   
    
    
});

app.post('/delete', (req, res) => {
    const listName = req.body.listName;

    if (listName === '') {
        Item.findByIdAndRemove(req.body.doneItem, (err) => {
            if (err) {
                console.log(err);
            } else {
                res.redirect('/');
            }
        }); 
    } else {
        List.findOneAndUpdate({listName: listName}, {
            $pull: {
                listItems: {
                    _id: req.body.doneItem
                }
            }
        }, (err, foundList) => {
            if (!err) {
                res.redirect('/' + listName)
            }
        });
    }        
});

app.post('/delete-list', (req, res) => {
    const listName = req.body.listName;
    const listDeleteButton = req.body.doneList;

    List.findByIdAndRemove(listDeleteButton, (err) => {
        if (!err) {
            res.redirect('/');
        }
    });
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Server listens on Port 3000');
});