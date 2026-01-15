# project manager (desktop app)

> a lightweight electron + react desktop app for managing project details locally with a clean, fast, and offline-first experience.

[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Version](https://img.shields.io/badge/version-0.0.0-blue)]()

## table of contents

* [introduction](#introduction)
* [prerequisites](#prerequisites)
* [installation](#installation)
* [usage](#usage)
* [configuration](#configuration)
* [api documentation](#api-documentation)
* [testing](#testing)
* [contributing](#contributing)
* [license](#license)

## introduction

project manager (desktop app) is a minimal, offline-first tool for managing project details. it allows you to create projects, store associated properties, and view project data in a clean, intuitive interface without requiring a backend.

**key features:**

* create and manage projects locally

    * store project details such as name, description, status, and due dates
* lightweight and fast desktop experience built with electron + react (vite)
* offline database using sqlite via `better-sqlite3`

## prerequisites

before running the project, ensure the following are installed:

* [node.js](https://nodejs.org/) (v16+)
* [npm](https://www.npmjs.com/)
* windows/macOS/linux (for electron support)
* optional: administrator access (required for building windows installer)

## installation

step-by-step instructions to set up the project locally:

```bash
# clone the repository
git clone https://github.com/mvntech/project-manager.git
cd project-manager

# install dependencies
npm install

# run in development mode
npm run dev
```

## usage

run the app in development mode:

```bash
npm run dev
```

run a production build:

```bash
npm run electron:build
```

after building, the installer is located in:

```
release/project manager-setup-0.0.0.exe
```

install and launch the app. you can now create and manage projects with their associated properties.

## configuration

environment variables and configuration options:

| variable            | description                                 | default                                        |
|---------------------| ------------------------------------------- | ---------------------------------------------- |
| VITE_DEV_SERVER_URL | url for vite dev server (electron dev mode) | [http://localhost:5173](http://localhost:5173) |

electron-specific configuration is in `electron/main.js`, including:

* `contextIsolation: true`
* `nodeIntegration: false`
* preload scripts for secure ipc

## api documentation

project manager uses a local sqlite database via `better-sqlite3`. main apis (electron main → renderer via preload):

### create project

```javascript
createProject(name, description, due_date, status = 'Pending')
```

adds a new project and returns the project id.

### update project

```javascript
updateProject(project_id, name, description, due_date, status)
```

updates project metadata.

### add project detail

```javascript
addProjectDetail(project_id, key, value, is_completed = 0)
```

stores additional project property values.

### get project with details

```javascript
getProjectWithDetails(project_id)
```

returns a project with all associated details.

### update project detail

```javascript
updateProjectDetail(project_detail_id, key, value, is_completed)
```

updates a specific project property.

### delete project

```javascript
deleteProject(project_id)
```

deletes a project and all its details.

### get all projects

```javascript
getAllProjects()
```

returns all projects ordered by created_at descending.

### delete project detail

```javascript
deleteProjectDetail(project_detail_id)
```

deletes a specific project property.

### close database

```javascript
closeDatabase()
```

closes the sqlite connection safely.

## testing

no automated tests currently. manual test procedure:

1. run the app in development mode
2. create a new project and add details
3. update and delete projects
4. verify database persistence in `userData/projects.db`

## contributing

contributions are welcome:

1. fork the repository
2. create a feature branch:

```bash
git checkout -b feature/amazing-feature
```

3. commit your changes:

```bash
git commit -m "add amazing feature"
```

4. push to your branch:

```bash
git push origin feature/amazing-feature
```

5. open a pull request

## license

distributed under the mit license. see `LICENSE` for more information.
created by [muntaha / mvntech] with love!♡
