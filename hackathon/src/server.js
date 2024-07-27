// JSON配列値の受けわたし

// 変数定義
// 配列の要素数の最大値（最大参加者人数）
const maxUser = 12;


const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

let todos = [
  { id: 1, text: 'Learn Express', completed: false },
  { id: 2, text: 'Learn React', completed: false },
];



// 全てのTodoを取得
app.get('/todos', (req, res) => {
  res.json(todos);
});

// 新しいTodoを追加
app.post('/todos', (req, res) => {
  const newTodo = {
    id: todos.length + 1,
    text: req.body.text,
    completed: false,
  };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// 特定のTodoを取得
app.get('/todos/:id', (req, res) => {
  const todo = todos.find(t => t.id === parseInt(req.params.id));
  if (!todo) return res.status(404).json({ message: 'Todo not found' });
  res.json(todo);
});

// Todoを更新　statusにして使える
app.put('/todos/:id', (req, res) => {
  const todo = todos.find(t => t.id === parseInt(req.params.id));
  if (!todo) return res.status(404).json({ message: 'Todo not found' });
  
  todo.text = req.body.text || todo.text;
  todo.completed = req.body.completed !== undefined ? req.body.completed : todo.completed;
  
  res.json(todo);
});

// Todoを削除
app.delete('/todos/:id', (req, res) => {
  const index = todos.findIndex(t => t.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: 'Todo not found' });
  
  todos.splice(index, 1);
  res.status(204).send();
});



/* 
    リスト定義
    {ユーザID(string), ステータス(number), } JSON形式
    index:席番号
    ０．なし　１．酒　　２．ゲーム　３．作業　４．離席 ……　
*/
let userData = [];

/* 
    配列からユーザID取得
    引数：席番号
*/
function GetUserID(seatNum){
    let [userID, status] = userData[seatNum]
    return userID;
}

//TODO: ユーザーアバターも格納して、ここでユーザーアイコン取得できるようにするかも

/* 
    配列からステータス取得
    引数：席番号
*/
function GetStatus(seatNum){
    let [userID, status] = userData[seatNum]
    return status;
}

/* 
    入室（配列に格納）
    引数：ユーザ名
*/
function EnterRoom(userID){
    if(userData.length==12){
        console.error("ERROR:これ以上参加できません。");
        return;
    }
    userData.push([userID, 0]);
}

/* 
    退室（配列から消去）
    引数：席番号
*/
function LeaveRoom(seatNum){
    userData.splite([seatNum, 1]);
}

/* 
    ステータス変更（配列更新）
    引数：席番号, 新しいステータス
*/
function ChangeStatus(seatNum, newStatus){
    let [userID, status] = userData[seatNum]
    userData[seatNum] = [userID, newStatus];
}