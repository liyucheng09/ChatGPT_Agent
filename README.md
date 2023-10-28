# A Game Demo Powered by ChatGPT Agents

<p align="center">
    <img src="https://github.com/liyucheng09/ChatGPT_Agent/blob/main/pics/logo.png" alt="Logo" width="auto" height="160" />
</p>

# 上手指南

1. 在OpenAI注册账号并创建API密钥。
2. 在src目录中新建.apikeys.ts文件。
3. 在此文件中添加 `export const CHATGPT_API_KEY = "复制并粘贴您的API密钥";`。
4. 运行 `yarn install` 安装依赖。
5. 运行 `yarn start` 启动应用。
6. 浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看应用。
7. 编辑后页面会自动重载。
8. 控制台会显示任何lint错误。

**更改故事背景和角色人格：**

- 更改地图信息：`src/backend/data/locationData.ts`
- 更改NPC人格：`src/backend/data/npcs/NpcData.ts`
- 更改NPC的Action，prompt等：`src/backend/services/ConversationService.ts`


# Details

You will need to an account with openai and create an api key.

Then in the src directory create a new file called .apikeys.ts (make sure not to commit this file or share your
api key with anyone else)

In this file add
`export const CHATGPT_API_KEY = "copy and paste your api key here";`

Then run `yarn install` to install dependencies, and `yarn start` to start the application. A browser window should open
with the app running. If it does not than try opening [http://localhost:3000](http://localhost:3000)

## Run on local machine

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

**Change the story background and character personalities:**

- Modify map information: `src/backend/data/locationData.ts`
- Modify NPC personalities: `src/backend/data/npcs/NpcData.ts`
- Modify NPC actions, prompts, etc.: `src/backend/services/ConversationService.ts`

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Thanks

Thanks for [blurrypiano](https://github.com/blurrypiano) for the general framework.
