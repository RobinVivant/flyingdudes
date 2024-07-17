# Flying Dudes

A React-based game project for the Computer Control course at SI4 2014.

## Project Overview

Flying Dudes is an interactive game that demonstrates principles of control systems and physics simulation. Players control a character ("dude") through various challenges, incorporating concepts from control theory such as open-loop control and state observation.

## Key Features

1. Physics-based gameplay using Phaser 3
2. Multiple game modes including manual control and auto mode
3. Target-based objectives (collecting "quilles")
4. Fuel management and consumption tracking
5. High score system

## Technical Stack

- React.js for the web application framework
- Phaser 3 for game rendering and physics
- p2.js for advanced physics simulation
- mathjs for matrix operations (used in control algorithms)

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
  - `game/`: Game logic (including FlyingDudes.js)
  - `assets/`: Game assets (images, sounds, etc.)
- `public/`: Public files

## Game Mechanics

- The player controls a character using arrow keys
- The goal is to reach target points ("quilles") while managing fuel consumption
- An auto mode demonstrates optimal path finding using open-loop control

## Control Theory Concepts

- State observation and estimation
- Open-loop control for trajectory planning
- Discrete-time system modeling

## Contributing

Contributions or suggestions are welcome through issues or pull requests. Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

- Jean-Paul Stromboni for course supervision
- The React and Phaser communities for their excellent frameworks and documentation
