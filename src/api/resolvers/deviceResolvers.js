
const { pool } = require("../../Config/dbConfig");

const deviceResolvers = {
  Query: {
    getDevicesByProject: async (_, { projectId }, { user}) => {
      if (!user) throw new Error('You must be logged in');
      const client = await pool.connect();
      try {
        const projectResult = await client.query("SELECT * FROM projects WHERE id = $1 AND user_id = $2", [projectId, user.userId]);
        if (projectResult.rows.length === 0) throw new Error('Project not found or access denied');

        const devicesResult = await client.query("SELECT * FROM devices WHERE project_id = $1 AND visible = true", [projectId]);
        return devicesResult.rows.map(device => ({
          ...device,
          project: projectResult.rows[0] 
        }));
      } finally {
        client.release();
      }
    },
    getDevice: async (_, { projectId, id }, { user}) => {
      if (!user) throw new Error('You must be logged in');
      const client = await pool.connect();
      try {
        const projectResult = await client.query("SELECT * FROM projects WHERE id = $1 AND user_id = $2", [projectId, user.userId]);
        if (projectResult.rows.length === 0) throw new Error('Project not found or access denied');

        const deviceResult = await client.query("SELECT * FROM devices WHERE id = $1 AND project_id = $2 AND visible = true", [id, projectId]);
        if (deviceResult.rows.length === 0) throw new Error('Device not found or access denied');

        return { ...deviceResult.rows[0], project: projectResult.rows[0] };
      } finally {
        client.release();
      }
    },
  },
  Mutation: {
    
      createDevice: async (_, { projectId, name, type, visible }, { user, pool }) => {
        if (!user) throw new Error('You must be logged in');
        const client = await pool.connect();
        try {
          const projectResult = await client.query("SELECT * FROM projects WHERE id = $1 AND user_id = $2", [projectId, user.userId]);
          if (projectResult.rows.length === 0) throw new Error('Project not found or access denied');
    
          const insertResult = await client.query(
            "INSERT INTO devices (name, type, visible, project_id) VALUES ($1, $2, $3, $4) RETURNING *",
            [name, type, visible, projectId]
          );
          return { ...insertResult.rows[0], project: projectResult.rows[0] };
        } finally {
          client.release();
        }
      },
      updateDevice: async (_, { id, projectId, name, type, visible }, { user, pool }) => {
        if (!user) throw new Error('You must be logged in');
        const client = await pool.connect();
        try {
          const projectDeviceResult = await client.query(
            "SELECT d.* FROM devices d JOIN projects p ON d.project_id = p.id WHERE d.id = $1 AND p.id = $2 AND p.user_id = $3",
            [id, projectId, user.userId]
          );
          if (projectDeviceResult.rows.length === 0) throw new Error('Device not found or access denied');
    
          const updateResult = await client.query(
            "UPDATE devices SET name = $1, type = $2, visible = $3 WHERE id = $4 RETURNING *",
            [name, type, visible, id]
          );
          return { ...updateResult.rows[0], project: { id: projectId } }; 
        } finally {
          client.release();
        }
      },
      
      deleteDevice: async (_, { id, projectId }, { user, pool }) => {
        if (!user) throw new Error('You must be logged in');
        const client = await pool.connect();
        try {
         
          const projectDeviceResult = await client.query(
            "SELECT d.* FROM devices d JOIN projects p ON d.project_id = p.id WHERE d.id = $1 AND p.id = $2 AND p.user_id = $3",
            [id, projectId, user.userId]
          );
          if (projectDeviceResult.rows.length === 0) throw new Error('Device not found or access denied');
    
          
          const deleteResult = await client.query(
            "UPDATE devices SET visible = false WHERE id = $1 RETURNING *",
            [id]
          );
          return { ...deleteResult.rows[0], project: { id: projectId } }; 
        } finally {
          client.release();
        }
      },
    },
    
}
module.exports = deviceResolvers;
