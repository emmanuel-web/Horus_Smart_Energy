
const { pool } = require("../../Config/dbConfig");

const projectResolvers = {
  Query: {
     
     getProjects: async (_, args, { user }) => {
      if (!user) throw new Error('You must be logged in');
      const client = await pool.connect();
      try {
        const result = await client.query("SELECT * FROM Project WHERE enabled = true AND usuario_id = $1", [user.userId]);
        return result.rows;
      } finally {
        client.release();
      }
    },
  },
  Mutation: {
    createProject: async (_, { name, enabled, time_zone }, { user }) => {
      if (!user) throw new Error('You must be logged in');
      const client = await pool.connect();
      try {
        const result = await client.query(
          "INSERT INTO Project (name, enabled, time_zone, usuario_id) VALUES ($1, $2, $3, $4) RETURNING *",
          [name, enabled ?? true, time_zone, user.userId]
        );
        return result.rows[0];
      } finally {
        client.release();
      }
    },
    updateProject: async (_, { id, name, enabled, time_zone }, { user }) => {
      if (!user) throw new Error('You must be logged in');
      const client = await pool.connect();
      try {
        const result = await client.query(
          "UPDATE Project SET name = $1, enabled = $2, time_zone = $3 WHERE id = $4 AND enabled = true AND usuario_id = $5 RETURNING *",
          [name, enabled, time_zone, id, user.userId]
        );
        return result.rows[0];
      } finally {
        client.release();
      }
    },
    deleteProject: async (_, { id }, { user }) => {
      if (!user) throw new Error('You must be logged in');
      const client = await pool.connect();
      try {
        const result = await client.query(
          "UPDATE Project SET enabled = false WHERE id = $1 AND usuario_id = $2 RETURNING *",
          [id, user.userId]
        );
        return result.rows[0];
      } finally {
        client.release();
      }
    },
  },
};

module.exports = projectResolvers;
