const express = require("express");
const db = require("./db");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("event management API is running!");
});

app.get("/events", async (req, res) => {
    try {
        const [rows] = await db.query("select * from  events");
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({
            error: "failed to fetch events"
        });
    }
});

app.get("/events/:id", async (req, res) => {
    try {
        const [rows] = await db.query(
            "select * from events where id = ?",
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                error: "event not found"
            });
        }

        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({
            error: "failed to fetch event"
        });
    }
});




app.post("/events", async (req, res) => {
    try {
        const {
            name,
            description,
            event_date,
            event_time,
            venue,
            capacity,
            status
        } = req.body;

        const [result] = await db.query(
            `insert into  events 
            (name, description, event_date, event_time, venue, capacity, status)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                name,
                description,
                event_date,
                event_time,
                venue,
                capacity,
                status
            ]
        );

        res.status(201).json({
            message: "Event created successfully",
            id: result.insertId
        });

    } catch (error) {
        res.status(500).json({
            error: "failed to create event"
        });
    }
});


app.put("/events/:id", async (req, res) => {
    try {
        const {
            name,
            description,
            event_date,
            event_time,
            venue,
            capacity,
            status
        } = req.body;

        const [result] = await db.query(
            `UPDATE events
             SET name = ?, description = ?, event_date = ?, event_time = ?,
                 venue = ?, capacity = ?, status = ?
             WHERE id = ?`,
            [
                name,
                description,
                event_date,
                event_time,
                venue,
                capacity,
                status,
                req.params.id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: "event not found"
            });
        }

        res.status(200).json({
            message: "event updated successfully"
        });

   } catch (error) {
    console.log(error);
    res.status(500).json({
        error: error.message
    });
    }
});

app.delete("/events/:id", async (req, res) => {
    try {
        const [result] = await db.query(
            "delete from  events where id = ?",
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: "event not found"
            });
        }

        res.status(200).json({
            message: "event deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            error: "failed to delete event"
        });
    }
});

app.listen(3000, () => {
    console.log("server is running on port 3000");
});