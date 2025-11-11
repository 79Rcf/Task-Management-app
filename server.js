import express from "express";
import cors from "cors";
import paginate from "express-paginate";
import { testConnection } from "./src/config/db.js";

/* import registerRoute from "./src/routes/register.js"; */
import loginRoute from "./src/routes/login.js"; 

import meRoute from "./src/routes/me.js";
import postsRoute from "./src/routes/posts.js";       
import postsByIdRoute from "./src/routes/postsById.js"; 
import postsUpdateRoute from "./src/routes/postsUpdate.js";
import postsDeleteRoute from "./src/routes/postsDelete.js";
import postCommentsRoute from "./src/routes/postComment.js";
import commentsRoute from "./src/routes/comments.js";
import { errorHandler } from "./src/middleware/errorHandler.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(paginate.middleware(10, 50)); 


app.use("/uploads", express.static("uploads"));


/* app.use("/register", registerRoute); */
app.use("/login", loginRoute); 
app.use("/me", meRoute);
app.use("/comments", commentsRoute);
app.use("/posts", postsRoute);       
app.use("/posts", postsByIdRoute);   
app.use("/posts", postsUpdateRoute);
app.use("/posts", postsDeleteRoute);
app.use("/posts", postCommentsRoute);


app.get("/", (req, res) => {
    res.send("Server is running live");
});


app.use(errorHandler);


const startServer = async () => {
    try {
        await testConnection();
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();