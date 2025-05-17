const { pool } = require("./database-config.js");

const testQuestion = {
  "category": "Web Development",
  "question": "What does a 404 HTTP status code mean?",
  "choices": ["Page moved", "Page not found", "Internal server error", "Request successful"],
  "answer": "Page not found"
}

const createQuestionsTable = async (err) => {
  const createTable = `CREATE TABLE IF NOT EXISTS questions(
    question_id SERIAL,
    category VARCHAR(50) NOT NULL,
    question VARCHAR(100) NOT NULL,
    choice_a VARCHAR(100) NOT NULL,
    choice_b VARCHAR(100) NOT NULL,
    choice_c VARCHAR(100) NOT NULL,
    choice_d VARCHAR(100) NOT NULL,
    PRIMARY KEY(question_id)
  );`;

  await pool.query(createTable);
  if(err) throw new Error(`Failed to create table: ${err}.`);
  return "Table created.";
}

const addQuestion = async(err) => {
  const addQuestionQuery = `INSERT INTO questions(category, question, choice_a, choice_b, choice_c, choice_d) 
    VALUES ($$${category}$$, $$${question}$$, $$${choice_a}$$, $$${choice_b}$$, $$${choice_c}$$, $$${choice_d}$$);`;

  await pool.query(addQuestionQuery);
  if(err) throw new Error(`Failed to add entry/entries to database: ${err}.`);
  return "Records added successfully."
}

const fetchQuestions = async (err, category, numOfQuestions) => {
  const displayQuestionsQuery = `SELECT * FROM questions WHERE category = ${category} ORDER BY RANDOM() LIMIT ${numOfQuestions}`;

  await pool.query(displayQuestionsQuery);
  if(err) throw new Error(`Failed to retrieve questions from database: ${err}.`);
  return "Entries fetched successfully."
}


// const testConnection = async () => {
//   try {
//     const res = await pool.query('SELECT NOW()');
//     console.log('Connected to PostgreSQL at', res);
//   } catch (err) {
//     console.error('Connection failed:', err.message);
//     process.exit(1);
//   }
// }

// testConnection();

module.exports = {
  createQuestionsTable,
  addQuestion,
  fetchQuestions
}
