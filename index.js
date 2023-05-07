let express = require(`express`);
let app = express();
let port = 3005;

app.listen(port, function () {
    console.log(`http://localhost:${port}`);
})

// Настройка БД
let mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/vote-app');

// Схемы
let votesSchema = new mongoose.Schema({
    title: String,
    description: String,
    positive: Number,
    negative: Number
});

let Vote = mongoose.model('vote', votesSchema);

// Раздача статики
app.use(express.static(`public`));

app.use(express.json());

//Подключение hbs
const hbs = require('hbs');
app.set('views', 'views');
app.set('view engine', 'hbs');


// Роуты API
app.get('/votes/all', async (req, res) => {
    let votes = await Vote.find();
    res.send(votes);
});

app.post('/votes/create', async (req, res) => {
    let title = req.body.title;
    let description = req.body.description;
    let vote = new Vote({
        title: title,
        description: description,
        positive: 0,
        negative: 0
    });
    await vote.save();
    res.send(vote);
});

app.post('/votes/remove', async (req, res) => {
    let id = req.body.id;
    await Vote.deleteOne({ _id: id });
    res.sendStatus(200);
});

app.post('/votes/positive', async (req, res) => {
    let id = req.body.id;
    let vote = await Vote.findOne({ _id: id });
    vote.positive++;
    await vote.save();
    res.send(vote);
});

app.post('/votes/negative', async (req, res) => {
    let id = req.body.id;
    let vote = await Vote.findOne({ _id: id });
    vote.negative++;
    await vote.save();
    res.send(vote);
});