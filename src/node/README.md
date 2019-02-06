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
* TODO: Continue with a better understanding
