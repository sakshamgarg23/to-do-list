const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

let taskList = [];
const dataFile = "./tasks.json";

// Load tasks from JSON file (if exists)
if (fs.existsSync(dataFile)) {
    taskList = JSON.parse(fs.readFileSync(dataFile, "utf8"));
}

// Home route: Display tasks
app.get("/", (req, res) => {
    res.render("index", { tasks: taskList });
});

// Add task route
app.post("/addtask", (req, res) => {
    const newTask = {
        name: req.body.newtask,
        category: req.body.category || "General",
    };
    if (newTask.name) {
        taskList.push(newTask);
        saveTasks();
    }
    res.redirect("/");
});

// Edit task route
app.post("/edittask", (req, res) => {
    const { oldName, newName } = req.body;
    const task = taskList.find(t => t.name === oldName);
    if (task) {
        task.name = newName;
        saveTasks();
    }
    res.redirect("/");
});

// Delete task route
app.post("/removetask", (req, res) => {
    const taskToDelete = req.body.task;
    taskList = taskList.filter(task => task.name !== taskToDelete);
    saveTasks();
    res.redirect("/");
});

// Save tasks to JSON file
function saveTasks() {
    fs.writeFileSync(dataFile, JSON.stringify(taskList, null, 2));
}

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
