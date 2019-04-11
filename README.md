# Express Todo List Back-End

教學影片連結(Youtube):
https://youtu.be/TAXNRZS1c3Y

github link:
https://github.com/kevinypfan/task-app-nodejs

gitlab link:
https://gitlab.nuuclab.club/lab305/task-app-nodejs/tree/master

postman cellections:
https://www.getpostman.com/collections/7bbd77ddafcead76b9fc

---

測試自打在這裡：HELLO DOG
░░░░░░░░▌▒█░░░░░░░░░░░▄▀▒▌
░░░░░░░░▌▒▒█░░░░░░░░▄▀▒▒▒▐
░░░░░░░▐▄▀▒▒▀▀▀▀▄▄▄▀▒▒▒▒▒▐
░░░░░▄▄▀▒░▒▒▒▒▒▒▒▒▒█▒▒▄█▒▐
░░░▄▀▒▒▒░░░▒▒▒░░░▒▒▒▀██▀▒▌
░░▐▒▒▒▄█▄▒▒▒░░░▒▒▒▒▒▒▒▀▄▒▒▌
░░▌░░█▀█▀▒▒▒▒█▄▀█ ▒▒▒▒▒▒▒█▒▐
░▐░░░▒▒▒▒▒▒▒▒███▀▒▒░░░▒▒▒▀▄▌
░▌░▒▄██▄▒▒▒▒▒▒▒▒▒░░░░░░▒▒▒▒▌
▌▒▀▐▄█▄█▌▄░▀▒▒░░░░░░░░░░▒▒▒▐
▐▒▒▐▀▐▀▒░▄▄▒▄▒▒▒▒▒▒░▒░▒░▒▒▒▒▌
▐▒▒▒▀▀▄▄▒▒▒▄▒▒▒▒▀▀█▀▀▒░▒░▒▒▐
░▌▒▒▒▒▒▒▀▀▀▒▒▒▒▒▒▀█▀▒░▒░▒▒▒▌
░▐▒▒▒▒▒▒▒▒▒▒▒▒▒▒▄▄█▄▄▒▒▄▒▒▐
░░▀▄▒▒▒▒▒▒▒▒▒▒▒░▒░▒░▒▄▀▒▒▒▌
░░░░▀▄▒▒▒▒▒▒▒▒▒▒▄▄▄▀▒▒▒▒▄▀
░░░░░░▀▄▄▄▄▄▄▀▀▀▒▒▒▒▒▄▄—

／　　Ｏ　|￣|　Ｏ　　 ╮ /
｜　　　　/　|　　　　｜ ))))))))) 　 FBI Open up！！！
＼、.　　 ├—┤ 　　　／ \
<img src="https://steamuserimages-a.akamaihd.net/ugc/940589313738467676/E1537FA87039584C178F3050C4321506AF475904/">
周師父好!!!!!!!!!!<<0.0
Excaliber~~~~~~~~~~
老闆萬歲~~~~
22k 萬歲~~~~~~~
$A$
龜~~派氣功=w=刪除線?

$\(MoM)/$
OAO...
uuid => 唯一 => University Unique Identifier
uuidv4()=>uuid 第四版的函式
{{url}}=>環境
undefined=false
control+d

---

## ES6 新增

### Arrow Funtion

```javascript=
//原本的寫法
function funtionName( param1, param2, ... )
{
    // some content...
}

//箭頭函式
var functionName = ( param1, param2, ... ) => {
    //some content...
}

// 當參數( param, parameter )只有一個的時候，小括號可以省略。
// 當函式內容只有一句時，大括號可以省略。
```

---

會員資料格式：

```jsonld=
const accounts = [
    {
        id: uuidv4(), //require("uuid/v4")
        name: 'Kevin',
        email: 'kevin@test.com',
        password: 'abc123',
        tokens: ['MTU1NDgxNjU2Mjc0OA']
    },
    {
        id: uuidv4(),
        name: 'Kao',
        email: 'kao@test.com',
        password: 'aaa123',
        tokens: []
    }
];

```

---

任務資料格式：

```json=
const tasks = [
    {
        id: uuidv4(),
        title: "hello",
        description: "world",
        completed: false,
        owner: req.user.id
    }
];
```

---

查詢所有用戶 API：

```javascript=
app.get('/accounts', (req, res) => {
    res.send(accounts);
});
```

---

會員註冊 API：

```javascript=
app.post('/signup', (req, res) => {
    const { name, email, password } = req.body;
    const findOne = accounts.find(e => e.email === email);
    if (findOne)
        return res.status(400).send({
            message: '您的email已重複!'
        });
    const token = genToken();
    const newUser = {
        id: uuidv4(),
        name,
        email,
        password,
        tokens: [token]
    };
    accounts.push(newUser);
    res.set('Authorization', token);
    res.status(201).send(newUser);
});
```

---

UUID:

通用唯一辨識碼（英語：Universally Unique Identifier，UUID），是用於電腦體系中以辨識資訊數目的一個 128 位元識別元，還有相關的術語：全域唯一識別元（GUID）。

根據標準方法生成，不依賴中央機構的註冊和分配，UUID 具有唯一性，這與其他大多數編號方案不同。重複 UUID 碼機率接近零，可以忽略不計。

---

genToken 方法：

```javascript=
function genToken() {
    const date = Date.now().toString();
    const base64Date = Buffer.from(date).toString('base64');
    const base64url = base64Date
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
    return base64url;
}
```

---

會員登入 API：

```javascript=
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = accounts.find(e => e.email === email);
    if (!user)
        return res.status(404).send({
            message: '找不到此用戶!'
        });
    if (user.password !== password)
        return res.status(401).send({
            message: '使用者密碼錯誤!'
        });
    const token = genToken();
    res.set('Authorization', token);
    user.tokens.push(token);
    res.send(user);
});
```

---

新增 Task API：

```javascript=
app.post('/tasks', authMiddleware, (req, res) => {
    const { title, description } = req.body;
    if (!title)
        return res.status(400).send({
            message: '任務至少要有標題!'
        });
    const task = {
        id: uuidv4(),
        title,
        description,
        completed: false,
        owner: req.user.id
    };
    tasks.push(task);
    res.send({
        ...task,
        owner: req.user
    });
});
```

---

登入認證 Middleware：

```javascript=
const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization').split(' ')[1];
    const user = accounts.find(e => e.tokens.indexOf(token) !== -1);
    if (!user)
        return res.status(401).send({
            message: '請先登入!'
        });
    req.user = user;
    next();
};
```

---

刪除 API：

```javascript=
app.delete('/task/:id', authMiddleware, (req, res) => {
    const task = tasks.find(e => e.id === req.params.id);
    if (!task)
        return res.status(404).send({
            message: '找不到此筆任務!'
        });
    if (req.user.id !== task.owner)
        return res.status(403).send({
            message: '您的權限不足!'
        });
    const taskIndex = tasks.map(e => e.id).indexOf();
    tasks.splice(taskIndex, 1);
    res.send({
        message: `deleted task id: ${req.params.id}`
    });
});
```

---

任務完成 API：

```javascript=
app.patch('/task/:id', authMiddleware, (req, res) => {
    const task = tasks.find(e => e.id === req.params.id);
    if (!task)
        return res.status(404).send({
            message: '找不到此筆任務!'
        });
    if (req.user.id !== task.owner)
        return res.status(403).send({
            message: '您的權限不足!'
        });
    if (req.query.completed) {
        task.completed = req.query.completed === 'true';
    } else {
        task.completed = !task.completed;
    }
    res.send(task);
});
```

---

列出全部的任務 API：

```javascript=
app.get('/tasks', (req, res) => {
    const populateTasks = tasks.map(task => ({
        ...task,
        owner: accounts.find(e => e.id === task.owner)
    }));
    res.send(populateTasks);
});
```

---

列出個人的任務 API：

```javascript=
app.get('/ownTasks', authMiddleware, (req, res) => {
    const ownTasks = tasks.filter(task => task.owner === req.user.id);
    res.send(ownTasks);
});
```

---

#### 補充常用 http status code

![](https://i.imgur.com/ZA7BnnO.png)

---

### 補充常用 es6 function

#### find 會把第一個找到的回傳（return 是 true 時）

這邊只會回傳 12

```js=
var array1 = [5, 12, 8, 130, 44];

var found = array1.find(function(element) {
    return element > 10;
});
```

---

#### map 會把陣列每個值做處理

這邊會把每個陣列\*2 處理回傳
新的陣列是 map1 [2, 8, 18, 32]

```js
var array1 = [1, 4, 9, 16];

// pass a function to map
const map1 = array1.map(x => x * 2);

console.log(map1);
```
