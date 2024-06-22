const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const path = require('path');

const app = express();
const port = 3000;

const url = 'mongodb://localhost:27017';
const dbName = 'attendance_meter';

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
    if (err) {
        console.error('Error connecting to MongoDB:', err);
        return;
    }

    console.log('Connected successfully to MongoDB');

    const db = client.db(dbName);
    const collection = db.collection('attendance_records');

    app.post('/submitAttendance', (req, res) => {
        const attendanceData = req.body;

        collection.insertOne(attendanceData, (err, result) => {
            if (err) {
                console.error('Error inserting attendance record:', err);
                res.status(500).json({ message: 'Error submitting attendance' });
                return;
            }

            console.log('Attendance submitted:', attendanceData);
            res.json({ message: 'Attendance submitted successfully' });
        });
    });

    app.post('/getAttendance', (req, res) => {
        const username = req.body.username;
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        collection.findOne({ username: username, dateTime: { $gte: todayStart, $lt: todayEnd } }, (err, result) => {
            if (err) {
                console.error('Error fetching attendance record:', err);
                res.status(500).json({ message: 'Error fetching attendance' });
                return;
            }

            res.json({ attendance: result });
        });
    });

    app.post('/attendanceDetails', (req, res) => {
        const username = req.body.username;
        const ISTDate = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Kolkata' // Convert current time to IST timezone
        });

        res.send(`You are marked present on ${ISTDate}`);
    });

    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
});










