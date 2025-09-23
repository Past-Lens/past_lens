import concurrently from "concurrently";

concurrently([
    {
        name: "Backend",
        command: "bun index.ts",
        cwd: "backend",
        prefixColor: "cyan"
    },
    {
        name: "Frontend",
        command: "bun index.ts",
        cwd: "frontend",
        prefixColor: "green"
    }
])