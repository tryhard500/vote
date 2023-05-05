axios.defaults.headers.post['Content-Type'] = 'application/json';

// Контейнер для вывода голосований
let container = document.querySelector(`.votes-container`);

// Массив для хранения голосований
let VOTES = [];

// Загрузка данных при запуске скрипта
loadVotes();
activateForm();

async function loadVotes() {
    // 1. Загрузи данные с сервера
    let response = await axios.get('/votes/all');
    // 2. Сохрани их в массив VOTES
    VOTES = response.data;
    // 3. Выведи массив на экран
    renderVotes();
}

function renderVotes() {
    // 1. Очисти контейнер
    container.innerHTML = ``;

    // 2. Нарисуй каждое голосование
    for (let i = 0; i < VOTES.length; i++) {
        // 3. Получи голосование
        let vote = VOTES[i];

        // 4. Выведи информацию о голосовании
        container.innerHTML += `
        <div class="vote card border-info mb-4">
            <div class="card-header border-info">
                <h5 class="card-title mb-0">
                    <a href="#">
                        ${vote.title}
                    </a>
                </h5>
            </div>
            <div class="card-body">
                <p class="card-text mb-4">
                    ${vote.description}
                </p>
                <div class="d-flex justify-content-between">
                    <div>
                        <button type="button" class="vote-positive btn btn-outline-success">
                            За
                            <span class="badge rounded-pill text-bg-success">
                                ${vote.positive}
                            </span>
                        </button>
                        <button type="button" class="vote-negative btn btn-outline-danger">
                            Против
                            <span class="badge rounded-pill text-bg-danger">
                                ${vote.negative}
                            </span>
                        </button>
                    </div>
                    <button type="button" class="vote-remove btn btn-outline-secondary">
                        Удалить голосование
                    </button>
                </div>
            </div>
        </div>
        `;
    }

    // 5. Повесь обработчики событий
    activateClicks();
    VotesPositive();
    VotesPositive();
}

function activateForm() {
    let form = document.querySelector(`#send-data`);
    form.addEventListener('submit', async (evt) => {
        evt.preventDefault();
        let response = await axios.post('/votes/create', form);
        let vote = response.data;
        VOTES.push(vote);
        form.reset();
        renderVotes();
    });
}

function activateClicks() {
    let removeButtons = document.querySelectorAll(`.vote-remove`);
    for (let i = 0; i < removeButtons.length; i++){
        let button = removeButtons[i];
        let vote = VOTES[i];
        button.addEventListener('click',async ()=>{
            let response = await axios.post('/votes/remove',{
                id: vote._id
            });
            VOTES.splice(i,1);
            renderVotes();
        });
    }
}


function VotesPositive() {
    let positiveButtons = document.querySelectorAll(`.vote-positive`);
    console.log('1');
    for (let i = 0; i < positiveButtons.length; i++){
        let button = positiveButtons[i];
        let vote = VOTES[i];
        console.log(vote);
        button.addEventListener('click',async ()=>{
            let response = await axios.post('/votes/positive',{
                id: vote._id
            });
            console.log(vote.positive);
            vote.positive++;
            console.log(vote.positive);
            renderVotes();
        });
    }
}


function VotesNegative() {
    let positiveButtons = document.querySelectorAll(`.vote-negative`);
    for (let i = 0; i < positiveButtons.length; i++){
        let button = positiveButtons[i];
        let vote = VOTES[i];
        button.addEventListener('click',async ()=>{
            let response = await axios.post('/votes/negative',{
                id: vote._id
            });
            vote.negative++;
            renderVotes();
        });
    }
}