import app from "./src/app.js";
import { connnectToDatabase } from "./src/config/database.js";

const PORT = process.env.PORT || 3000;

connnectToDatabase()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error: unknown) => {
        console.error("Failed to start server:", error);
        process.exit(1);
    });