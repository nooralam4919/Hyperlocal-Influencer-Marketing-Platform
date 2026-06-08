Frontend (React/UI)
|
| Request (req) => A request is data sent from the UI to the server.
v
Backend (Node/Express)
|
| Response (res) => A response is data sent from the server back to the UI.

Frontend (React/UI)


(req) = data coming to the server.

(res) = data going from the server back to the client.






In Express.js, the most common methods are:

app.get()
app.post()
app.put()
app.patch()
app.delete()

These correspond to HTTP methods used by the frontend to communicate with the backend.

1. GET → Fetch Data (muche data do)

Used when you want to retrieve data.

 Frontend
fetch("/users");

Backend
        app.get("/users", (req, res) => {
        res.send("List of users");
        });

Flow
Frontend
   │
   │ GET /users
   ▼
Backend
   │
   ▼
"List of users"

Example:

Get all products
Get user profile
Get posts



2. POST → Create Data (mera data looo)

Used when you want to send new data to the server.

Frontend
fetch("/users", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        name: "Noor"
    })
});

Backend
app.post("/users", (req, res) => {
    console.log(req.body);
    res.send("User created");
});

Flow
Frontend
   │
   │ POST /users
   │ {name:"Noor"}
   ▼
Backend
   │
   ▼
User created

Example:

Register user
Create product
Add comment

3. PUT → Replace Entire Data

Used when you want to update the entire resource.

Suppose user:

{
  "name": "Noor",
  "age": 21
}
Frontend
fetch("/users/1", {
    method: "PUT",
    body: JSON.stringify({
        name: "Noor Alam",
        age: 22
    })
});
Backend
app.put("/users/:id", (req, res) => {
    res.send("User updated");
});
Flow
Old User
{name:"Noor", age:21}

PUT

New User
{name:"Noor Alam", age:22}

4. PATCH → Update Partial Data

Used when you want to update only specific fields.

Frontend
fetch("/users/1", {
    method: "PATCH",
    body: JSON.stringify({
        age: 22
    })
});
Backend
app.patch("/users/:id", (req, res) => {
    res.send("Age updated");
});
Flow
Before
{name:"Noor", age:21}

PATCH age=22

After
{name:"Noor", age:22}

Only changed fields are updated.

5. DELETE → Remove Data

Used when you want to delete something.

Frontend
fetch("/users/1", {
    method: "DELETE"
});
Backend
app.delete("/users/:id", (req, res) => {
    res.send("User deleted");
});
Flow
Frontend
   │
   │ DELETE /users/1
   ▼
Backend
   │
   ▼
User removed
Route Parameters (:id)
app.get("/users/:id", (req, res) => {
    console.log(req.params.id);
});

Request:

/users/123

Output:

123

Diagram:

/users/123
        │
        ▼
req.params.id
        │
        ▼
      123
Query Parameters
app.get("/search", (req, res) => {
    console.log(req.query.name);
});

Request:

/search?name=noor

Output:

noor

Diagram:

/search?name=noor
              │
              ▼
     req.query.name
              │
              ▼
            noor
Request Body
app.post("/user", (req, res) => {
    console.log(req.body);
});

Frontend:

fetch("/user", {
    method: "POST",
    body: JSON.stringify({
        name: "Noor",
        age: 21
    })
});

Backend receives:

req.body = {
    name: "Noor",
    age: 21
}