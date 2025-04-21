const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');
const bodyParser = require('body-parser');

const route = require('./app/routes');
const config = require('./app/config');

const allowedOrigins = ['http://localhost:3000', 'http://192.168.1.53:3000'];

// Cấu hình CORS
const corsOptions = {
    origin: (origin, callback) => {
        // Kiểm tra nếu nguồn trong danh sách allowedOrigins
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
};

const app = express();
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ limit: '500mb', extended: true }));
app.use(bodyParser.json({ limit: '500mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '500mb' }));
app.use(morgan('combined'));
app.use('/uploads/ads', express.static(path.join(__dirname, 'uploads/ads/')));

route(app);

module.exports = app;
