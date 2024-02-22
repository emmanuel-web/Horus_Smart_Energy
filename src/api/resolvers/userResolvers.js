const { pool } = require("../../Config/dbConfig");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const saltRounds = 10;

const findUserByUsername = async (username) => {
  const query = "SELECT * FROM users WHERE username = $1";
  const values = [username];
  try {
    const result = await pool.query(query, values);
    return result.rows[0]; 
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const userResolvers = {
  Query: {
    getUsers: async (_, args, { user }) => {
      const client = await pool.connect();
      try {
        const result = await client.query("SELECT * FROM users");
        return result.rows;
      } finally {
        client.release();
      }
    },
  },
  Mutation: {
    login: async (_, { username, password }) => {
      const user = await findUserByUsername(username); 
      if (!user || !bcrypt.compareSync(password, user.password)) {
        throw new Error("Invalid credentials");
      }
    
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return {
        token,
        user: {
          id: user.id,
          username: user.username
          
        },
      };
    },
    

    createUser: async (_, { username, password }) => {
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const client = await pool.connect();
      try {
        const result = await client.query(
          "INSERT INTO users (username, password) VALUES ($1,$2) RETURNING *",
          [username, hashedPassword]
        );
        return result.rows[0];
      } finally {
        client.release();
      }
    },
    updateUser: async (_, {username},{ user }) => {
      if (!user) throw new Error('You must be logged in');
      const client = await pool.connect();
      try {
        const result = await client.query(
          "UPDATE users SET username = $1 WHERE id = $2 RETURNING *",
          [username, user.userId]
        );
        return result.rows[0];
      } finally {
        client.release();
      }
    },
    deleteUser: async (_, { id }) => {
      if (!user) throw new Error('You must be logged in');
      const client = await pool.connect();
      try {
        const result = await client.query(
          "DELETE FROM users WHERE id = $1 RETURNING *",
          [id]
        );
        return result.rows[0];
      } finally {
        client.release();
      }
    },
  },
};

module.exports = userResolvers;
