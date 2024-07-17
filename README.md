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
# Flying Dudes: A Blast from the Past!

Hey there, fellow time travelers! 👋 Welcome to the Flying Dudes repo, a nostalgic journey back to 2014 when my buddy Antoine and I were just a couple of wide-eyed SI4 students trying to impress our Computer Control prof, Jean-Paul Stromboni.

## What's This All About?

Picture this: It's 2014, Pharrell's "Happy" is playing everywhere, and we're coding like mad to create this wacky game where dudes fly around collecting targets. Why? Because college, that's why! 🎓

Fast forward to today (holy cow, has it really been 10 years?), and I've decided to dust off this old gem and give it a modern makeover with Next.js. Why? Because nostalgia is one hell of a drug, my friends!

## The Time Machine (aka Live Demo)

Wanna see what happens when you mix 2014 creativity with 2024 tech? Check out the live demo at https://flying-dudes.pages.dev/. Warning: May cause uncontrollable urges to relive your college days!

## A Trip Down Memory Lane

For those history buffs out there (or if you just want a good laugh), the original 2014 version is safely tucked away in the "master-2014" branch. It's like a digital time capsule, minus the buried-in-the-backyard part.

## Fire It Up!

Feeling nostalgic and want to run this bad boy locally? Here's how:

1. Clone this repo (like it's 2014 all over again)
2. Run `npm install` (some things never change)
3. Hit it with `npm run dev`
4. Travel back in time to http://localhost:3000

## Want to Contribute?

Did this blast from the past inspire you? Got some ideas to make Flying Dudes even cooler? Pull requests are welcome! Just remember, with great power comes great responsibility (and potential for adding more flying dudes).

## License to Chill

This project is as free as we thought we were in college. Use it, abuse it, love it. Just maybe buy Antoine and me a beer if you make millions off it, yeah?

---

Shoutout to Antoine Lavail, my partner in crime for this project. Dude, if you're reading this, remember when we thought this would make us the next big thing in gaming? Good times! 🍻

And to Professor Stromboni - I hope we finally nailed that A+ we were gunning for. Better late than never, right?

Here's to code that stands the test of time, friendships forged in the fires of debugging, and the eternal question: "Why the heck did we call it Flying Dudes anyway?"

Keep on flying, dudes and dudettes! 🚀
