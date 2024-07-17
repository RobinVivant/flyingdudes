# Flying Dudes

Flying Dudes is an interactive game project developed as part of the SI4 2014 course on Computer Control, supervised by Jean-Paul Stromboni.

## Project Overview

This project is a Meteor-based web application that implements a physics-based game where players control a character ("dude") through various challenges. The game incorporates concepts from control theory, including open-loop control and state observation.

## Key Features

1. Physics-based gameplay using Phaser.js
2. Multiple game modes including manual control and auto mode
3. Target-based objectives (collecting "quilles")
4. Fuel management and consumption tracking
5. High score system for both manual and auto modes

## Technical Stack

- Meteor.js for the web application framework
- Phaser.js for game rendering and physics
- Sylvester.js for matrix operations (used in control algorithms)

## File Structure

- `/App`: Main application directory
  - `/client`: Client-side code
    - `/views`: Templates and view logic
    - `/styles`: CSS and LESS files
  - `/public`: Static assets
- `package.json`: Project dependencies

## Key Components

1. `Fyd` class (`App/client/views/play/Game/GameP4.js`): Main game logic
2. Router (`App/client/routes.js`): Defines application routes
3. Templates (`App/client/views/`): HTML templates for different views

## Game Mechanics

- The player controls a character using arrow keys or mouse clicks
- The goal is to reach target points ("quilles") while managing fuel consumption
- An auto mode demonstrates optimal path finding using open-loop control

## Control Theory Concepts

- State observation and estimation
- Open-loop control for trajectory planning
- Discrete-time system modeling

## Getting Started

1. Install Meteor.js
2. Clone this repository
3. Run `meteor npm install` to install dependencies
4. Start the application with `meteor run`

## Contributing

This project was developed as part of a course assignment. While it's not actively maintained, contributions or suggestions are welcome through issues or pull requests.

## License

This project is licensed under the ISC License. See the `package.json` file for details.

## Acknowledgments

- Jean-Paul Stromboni for course supervision
- The Meteor and Phaser communities for their excellent frameworks and documentation
# Flying Dudes

A React-based game project for the Computer Control course at SI4 2014.

## Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/flying-dudes.git
   cd flying-dudes
   ```

2. Install dependencies:
   ```
   npm install
   ```

## Running the Development Server

To start the development server:

```
npm start
```

The game will be available at `http://localhost:3000`.

## Building for Production

To create a production build:

```
npm run build
```

This will create a `build` directory with the production-ready files.

## Project Structure

- `src/`: Source code
  - `components/`: React components
  - `pages/`: Page components
  - `game/`: Game logic
  - `assets/`: Game assets (images, sounds, etc.)
- `public/`: Public files

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
