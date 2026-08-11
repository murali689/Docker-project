const express = require("express");
const pool = require("./db");

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());

/*
 * Health check
 */
app.get("/", (req, res) => {
  res.json({
    application: "Users CRUD API",
    status: "running",
    version: "1.0.0"
  });
});

/*
 * Database health check
 */
app.get("/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.status(200).json({
      status: "healthy",
      database: "connected",
      time: result.rows[0].now
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: "unhealthy",
      database: "disconnected"
    });
  }
});

/*
 * CREATE USER
 */
app.post("/users", async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        error: "Name and email are required"
      });
    }

    const result = await pool.query(
      "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
      [name, email]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error(error);

    if (error.code === "23505") {
      return res.status(409).json({
        error: "Email already exists"
      });
    }

    res.status(500).json({
      error: "Failed to create user"
    });
  }
});

/*
 * GET ALL USERS
 */
app.get("/users", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM users ORDER BY id ASC"
    );

    res.status(200).json(result.rows);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to retrieve users"
    });
  }
});

/*
 * GET USER BY ID
 */
app.get("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM users WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "User not found"
      });
    }

    res.status(200).json(result.rows[0]);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to retrieve user"
    });
  }
});

/*
 * UPDATE USER
 */
app.put("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        error: "Name and email are required"
      });
    }

    const result = await pool.query(
      `UPDATE users
       SET name = $1,
           email = $2
       WHERE id = $3
       RETURNING *`,
      [name, email, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "User not found"
      });
    }

    res.status(200).json(result.rows[0]);

  } catch (error) {
    console.error(error);

    if (error.code === "23505") {
      return res.status(409).json({
        error: "Email already exists"
      });
    }

    res.status(500).json({
      error: "Failed to update user"
    });
  }
});

/*
 * DELETE USER
 */
app.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM users WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "User not found"
      });
    }

    res.status(200).json({
      message: "User deleted successfully",
      user: result.rows[0]
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to delete user"
    });
  }
});

/*
 * Start server
 */
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Users API running on port ${PORT}`);
});