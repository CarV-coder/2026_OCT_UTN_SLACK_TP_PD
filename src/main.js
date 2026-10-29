import connectMongoDB from "./config/mongo.config.js";
import { testMysqlConnection } from "./config/mysql.config.js";

/* connectMongoDB() */
//testMysqlConnection()

import express from "express";
import errorHandlerMiddleware from "./middlewares/error.middleware.js";
import authMiddleware from "./middlewares/auth.middleware.js";
import auth_router from "./routes/auth.Router.js";
import user_router from "./routes/user.router.js";
import workspace_router from "./routes/workspace.router.js";
import mailer_transporter from "./config/mailer.config.js";
import user_repository from "./repositories/user.repository.js";
import cors from "cors";

const PORT = process.env.PORT
const app = express()

/* 
Deshabilita la cors policy = cualquiera puede consultar
*/
app.use(cors())
app.use(express.json())

app.use(async (req, res, next) => {

    try {
        await connectMongoDB();
        next();
    } catch (error) {
        console.error("Error conectando MongoDB:", error);
        
        res.status(503).json({
            message: "No se pudo conectar a la base de datos"
        });
    }
});





/* 
Todas las consultas que lleguen a /api/auth las manejará el auth_router
*/
app.use('/api/auth', auth_router)
app.use('/api/users', user_router)
app.use('/api/workspaces', authMiddleware, workspace_router)


app.get(
    '/api/status',
    (request, response) => {
        return response.send(['hola, les traigo paz y amor'])
    }
)

/* mailer_transporter.sendMail(
    {
        to: "mati.dev.gimenez@gmail.com",
        from: ENVIRONMENT.GMAIL_USER,
        subject: 'Mail de prueba',
        html: `
        <body>
            <h1>Esto es un mail de prueba</h1>
        </body>
        `
    }
) */


app.use(
    errorHandlerMiddleware
)


app.listen(
    PORT,
    () => {
        console.log(
            `El servidor se esta escuchando correctamente en http://localhost:${PORT}`
        )
    }
)

//user_repository.create('test-1', 'test-1@gmail.com', 'test123')

/* user_repository.get()

user_repository.getById(1) */