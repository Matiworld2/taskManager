import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";
import express, { json } from "express";
import session from "express-session";
import { engine } from "express-handlebars";

const prisma = new PrismaClient();
const app = express();
const port = 3000;

app.use(express.urlencoded());
app.use(express.json());
app.use(
  session({ secret: "eueueu kurwy rozjebie ", cookie: { maxAge: 600000 } })
);
app.use(express.static("public"));
app.set("views", "./views");
app.engine("handlebars", engine());
app.set("view engine", "handlebars");

//=========== Dashboard
app.get("/", async (req, res) => {
  if (!req.session.userId) {
    return res.redirect("/login");
  }
  const tasks = await prisma.tasks.findMany({
    where: { userId: session.userId, idDone: false },
    orderBy: { createdAt: "desc" },
  });

  const lateTask = [];
  tasks.forEach((v) => {
    lateTask.push(v);
  });

  console.log(req.session);
  return res.render("dashboard", lateTask);
});

//===============GET Login
app.get("/login", (req, res) => {
  res.render("loginPage");
});

//===============GET Register
app.get("/register", (req, res) => {
  res.render("registerPage");
});

//============= GET Register
app.post("/register", async (req, res) => {
  const hashedPassowrd = await bcrypt.hash(req.body.password, 12);
  const user = await prisma.users.create({
    data: {
      password: hashedPassowrd,
      email: req.body.email,
      login: req.body.login,
    },
  });

  req.session.userId = user.id;
  res.redirect("/");
});

//============= Post Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.users.findUnique({
    where: { email },
  });
  if (await bcrypt.compare(password, user.password)) {
    req.session.userId = user.id;
    return res.redirect("/");
  }
});

//============= Add Task
app.post("/addTask", async (req, res) => {
  const { name, description } = req.body;
  console.log(req.session.userId);
  const task = await prisma.tasks.create({
    data: {
      name,
      description,
      userId: req.session.userId,
    },
  });
  return res.redirect("/");
});

//============= Delete Task
app.post("/deleteTask/:id", async (req, res) => {
  await prisma.tasks.delete({ where: { taskId: req.params.id } });
  return res.redirect("/");
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
