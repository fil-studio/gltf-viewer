# Fil Studio: Front-End Boilerplates

This repository contains the starter "boilerplates" for different Front-End configurations. There are 3 different barnches, each one depends on the previous one (needs to be merged accordingly) to keep up-to date.

## Main

Main Branch is the template for a web Front-End project using 11ty, ESBuild, SASS & Nunjucks. No back-end dependency here. It uses our [fils](https://github.com/fil-studio/fils/tree/main) framework.

Download/Clone + Start Here with `yarn` or `npm i` and then `yarn dev` or `npm run dev` to launch static server.

Uses [11ty](https://www.11ty.dev/) static generator and [ThreeJS](https://threejs.org/) for WebGL based sketches.

Happy Coding!

## Electron

This Branch adds Electron packaging targeting installations & Desktop Apps. It is still based in the main structure and you can still work on the web browser for everything but strictly desktop features.

It has OSC Communication API which we often use in installations already built in.

We added Electron Forge, if signing apps is needed. We have also electron packager build scripts which will allow you building Windows Apps from a Mac or Linux device vioa [Wine](https://www.winehq.org/).

**Added scripts:**
- `yarn test` runs the desktop app
- `yarn package` packages desktop app using Forge
- See other packaging scripts with `electron-packager`

This branch depends on main (should merge its changes).

## Electron-Unity

This branch adds a slave Unity rendering Web layer via WebRTC on top of the previous branch. It contains the Unity Project Template and the necessary WS server to communicate between the Unity background App and the main web app.

This branch depends on electron (should merge its changes).

## Toolkit

This is located currently here: [Toolkit Boilerplate](https://github.com/fil-studio/toolkit-boilerplate-v2)

### Dev Notes
Current Sketch version has migrated to `@fils/gl-dom` structure.


### License

Copyright 2024, Fil Studio

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

[http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.