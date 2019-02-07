## Creating a Typescript Node project

* Install latest **NPM** and **VSCode**
* Create Empty Folder and from within the folder
* In terminal run
    ``` 
    npm init.
    ```
* Install **dev dependencies** *npm install <package> --save-dev*
    ``` 
    npm install concurrently typescript lite-server --save-dev
    ```
* If you do not have tsc installed globally, do it
    ``` 
    npm install -g typescript
    ```
* Create a *tsconfig.json*
    ``` 
    tsc --init
    ``` 
* In our scripts object within *package.json* we defined our **TypeScript compiler** with *"tsc": "tsc"*, and our TypeScript compiler in **watch mode** *"tsc:w": "tsc -w"*, **lite server** as *"lite": "lite-server"* and finally our all-important start command.
    ``` 
    "start": "concurrently \"npm run tsc:w\" \"npm run lite\" "
    ```
* Understand the [Typscript compiler options](https://www.typescriptlang.org/docs/handbook/compiler-options.html), I defaulted to the same settings I use in Angular projects but feel free to alter it anyway you feel.

* [Understanding server light](https://medium.freecodecamp.org/how-you-can-use-lite-server-for-a-simple-development-web-server-33ea527013c9) for simply hosting my server untilmoving on.

* Do a typescript with https://blog.risingstack.com/building-a-node-js-app-with-typescript-tutorial/

    * Create an express API utilising https://expressjs.com/

    * Use TSLint instead at https://palantir.github.io/tslint/
    ```     
    npm install tslint typescript --save-dev
    ``` 

* https://developer.okta.com/blog/2018/11/15/node-express-typescript
* The TypeScript compiler does the work of generating the JavaScript files and copies them to the dist folder. However, it does not copy the other types of files the project needs to run, such as the EJS view templates. To accomplish this, create a build script that copies all the other files to the *dist* folder.
    ```     
    npm install --save-dev ts-node shelljs fs-extra nodemon rimraf npm-run-all
    npm install --save-dev @types/fs-extra @types/shelljs
    ```     
    * Here is a quick overview of the modules you just installed.
        * [ts-node](https://www.npmjs.com/package/ts-node) Use to run TypeScript files directly.
        * [shelljs](https://www.npmjs.com/package/shelljs) Use to execute shell commands such as to copy files and remove directories.
        * [fs-extra](https://www.npmjs.com/package/fs-extra) A module that extends the Node.js file system (fs) module with features such as reading and writing JSON files.
        * [rimraf](https://www.npmjs.com/package/rimraf) Use to recursively remove folders.
        * [npm-run-all](https://www.npmjs.com/package/npm-run-all) Use to execute multiple npm scripts sequentially or in parallel.
        * [nodemon](https://www.npmjs.com/package/nodemon) A handy tool for running Node.js in a development environment. Nodemon watches files for changes and automatically restarts the Node.js application when changes are detected. No more stopping and restarting Node.js!
    * Node.js applications typically use environment variables for configuration. However, managing environment variables can be a chore. A popular module for managing application configuration data is [dotenv](https://www.npmjs.com/package/dotenv)
        ```   
        npm install dotenv
        npm install --save-dev @types/dotenv
        ```
        ```JAVASCRIPT    
        # Set to production when deploying to production
        NODE_ENV=development

        # Node.js server configuration
        SERVER_PORT=9000
        ```
    * Your Node.js application is off to a great start, but perhaps not the best looking, yet. This step adds [Materialize](https://materializecss.com/), a modern CSS framework based on Google’s Material Design, and [Embedded JavaScript Templates](https://www.npmjs.com/package/ejs) (EJS), an HTML template language for Express. Materialize and EJS are a good foundation for a much better UI.
