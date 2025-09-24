# past_lens

A digital Museum

Commands

```bash
npm init -y // add a package.json
```

## Changing the JS runtime to 'bun'

- Bun is faster
- Bun is an 'All-in-One' stop Shop

To install Bun globally on your machine, Run:
    for windows

```bash
powershell -c "irm bun.sh/install.ps1 | iex"
```

for macOs/linux

```bash
curl -fsSL https://bun.sh/install | bash
```

with Bun installed, run the following commands to install dependencies

```bash
cd backend
```
```bash
bun i
```

```bash
cd frontend
```
```bash 
bun i
```

then move to the root directory and run 

```bash
bun i
```

## Automate code formatting before committing 

- Configured tools like `Husky` and `Prettier` to auto format code for readability before commiting

## Configured the backend and frontend to run on one terminal

- With a tool called `concurrently` the backend and frontend can now run on same terminal

- MOVE TO THE ROOT DIRECTORY OF THE PROJECT AND RUN: 

```bash
bun run dev
```

- RUNNING THE frontend AND backend SEPARATELY STILL WORKS

### Getting started with Bun

- to install dependencies:
 `bun add <package_name>`

 or 
  `bun add -d <package_name>` for development dependecies

changed the backend Hot reload command from 
```bash
    "dev": "nodemon --watch index.ts --exec ts-node index.ts"
```
to 

```bash
bun --hot index.ts
```
