import concurrently from 'concurrently';

concurrently([
    {
        name: 'Backend',
        command: 'bun run dev',
        cwd: 'backend',
        prefixColor: 'cyan',
    },
    {
        name: 'Frontend',
        command: 'bun run dev',
        cwd: 'frontend',
        prefixColor: 'green',
    },
]);
