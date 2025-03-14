import { type ISourceOptions } from "@tsparticles/engine";

const particleConfig: ISourceOptions = {
  fullScreen: {
    enable: true,
  },
  fpsLimit: 60,
  particles: {
    shape: {
      type: "circle",
    },
    size: {
      value: { min: 2, max: 4 },
    },
  },
  detectRetina: true,
  themes: [
    {
      name: "default",
      default: {
        value: true,
        mode: "any",
      },
      options: {
        particles: {
          color: {
            value: "#D9D9D9",
          },
          links: {
            color: "#D9D9D9",
            distance: 100,
            enable: true,
            opacity: 0.75,
            width: 1,
          },
          move: {
            direction: "none",
            enable: true,
            outModes: {
              default: "out",
            },
            random: false,
            speed: 0.1,
            straight: false,
          },
          number: {
            density: {
              enable: true,
              height: 1200,
              width: 1200,
            },
            value: 100,
          },
          opacity: {
            value: 0.5,
          },
        },
        background: {
          color: {
            value: "#FEFDF4",
          },
        },
      },
    },
    {
      name: "1",
      default: {
        value: true,
        mode: "any",
      },
      options: {
        particles: {
          color: {
            value: "#D9D9D9",
          },
          links: {
            color: "#D9D9D9",
            distance: 125,
            enable: true,
            opacity: 0.5,
            width: 1,
          },
          move: {
            direction: "none",
            enable: true,
            outModes: {
              default: "out",
            },
            random: false,
            speed: 0.1,
            straight: false,
          },
          number: {
            density: {
              enable: true,
              height: 1200,
              width: 1200,
            },
            value: 100,
          },
          opacity: {
            value: 0.5,
          },
        },
        background: {
          color: {
            value: "#FEFDF4",
          },
        },
      },
    },
    {
      name: "2",
      default: {
        value: false,
        mode: "any",
      },
      options: {
        manualParticles: [
          {
            position: { x: 50, y: 50 }, // Position the central particle in the middle
            options: {
              move: {
                enable: false,
              },
              size: {
                value: 8, // Larger size to emphasize central particle
              },
              color: {
                value: "#D9D9D9",
              },
              links: {
                enable: true, // Enable links specifically for this central particle
                distance: 550, // Greater distance to connect with many nodes
                opacity: 0.6,
                color: "#D9D9D9",
                width: 2,
              },
            },
          },
        ],
        particles: {
          color: {
            value: "#D9D9D9",
          },
          links: {
            color: "#D9D9D9",
            distance: 125,
            enable: true,
            value: 0.25,
            width: 1,
          },
          move: {
            direction: "none",
            enable: true,
            outModes: {
              default: "out",
            },
            random: true,
            speed: 0.1,
            straight: false,
          },
          number: {
            density: {
              enable: true,
              height: 1200,
              width: 1200,
            },
            value: 100,
          },
          opacity: {
            value: 0.5,
          },
        },
        background: {
          color: {
            value: "#FEFDF4",
          },
        },
      },
    },
    {
      name: "3",
      default: {
        value: true,
        mode: "any",
      },
      options: {
        particles: {
          color: {
            value: "#D9D9D9",
          },
          links: {
            color: "#D9D9D9",
            distance: 150,
            enable: true,
            opacity: 0.25,
            width: 1,
          },
          move: {
            direction: "inside",
            enable: true,
            outModes: {
              default: "out",
            },
            random: true,
            speed: 0.1,
            straight: false,
          },
          number: {
            density: {
              enable: true,
              height: 1200,
              width: 1200,
            },
            value: 100,
          },
          opacity: {
            value: 0.5,
          },
        },
        background: {
          color: {
            value: "#FEFDF4",
          },
        },
        manualParticles: [
          {
            position: { x: 50, y: 50 }, // Position the central particle in the middle
            options: {
              move: {
                enable: false,
              },
              size: {
                value: 8, // Larger size to emphasize central particle
              },
              color: {
                value: "#D9D9D9",
              },
              links: {
                enable: true, // Enable links specifically for this central particle
                distance: 650, // Greater distance to connect with many nodes
                opacity: 0.7,
                color: "#D9D9D9",
                width: 2,
              },
            },
          },
        ],
      },
    },
    {
      name: "4",
      default: {
        value: true,
        mode: "any",
      },
      options: {
        manualParticles: [
          {
            position: { x: 50, y: 50 }, // Position the central particle in the middle
            options: {
              move: {
                enable: false,
              },
              size: {
                value: 8, // Larger size to emphasize central particle
              },
              color: {
                value: "#D9D9D9",
              },
              links: {
                enable: true, // Enable links specifically for this central particle
                distance: 900, // Greater distance to connect with many nodes
                opacity: 0.7,
                color: "#D9D9D9",
                width: 2,
              },
            },
          },
        ],
        particles: {
          color: {
            value: "#D9D9D9",
          },
          links: {
            color: "#D9D9D9",
            distance: 100,
            enable: true,
            opacity: 0.5,
            width: 1,
          },
          move: {
            direction: "inside",
            enable: true,
            outModes: {
              default: "out",
            },
            random: true,
            speed: 0.1,
            straight: false,
          },
          number: {
            density: {
              enable: true,
              height: 1200,
              width: 1200,
            },
            value: 100,
          },
          opacity: {
            value: 0.5,
          },
        },
        background: {
          color: {
            value: "#FEFDF4",
          },
        },
      },
    },
    {
      name: "5",
      options: {
        particles: {
          color: {
            value: "#D9D9D9",
          },
          links: {
            color: "#D9D9D9",
            distance: 200,
            enable: true,
            opacity: 0.25,
            width: 1,
          },
          move: {
            direction: "none",
            enable: true,
            outModes: {
              default: "out",
            },
            random: true,
            speed: 1,
            straight: false,
          },
          number: {
            density: {
              enable: true,
              height: 1200,
              width: 1200,
            },
            value: 200,
          },
          orbit: {
            animation: {
              enable: true,
              speed: 1,
            },
            enable: true,
            opacity: 1,
            color: "#ff7700",
            rotation: {
              random: {
                enable: true,
              },
            },
          },
          opacity: {
            value: 0.5,
          },
          shape: {
            type: "circle",
          },
          size: {
            value: { min: 2, max: 4 },
          },
        },

        background: {
          color: {
            value: "#FEFDF4",
          },
        },
        manualParticles: [
          {
            position: { x: 30, y: 30 }, // Position the central particle in the middle
            options: {
              move: {
                enable: true,
                speed: 0.25,
              },
              size: {
                value: 4, // Larger size to emphasize central particle
              },
              color: {
                value: "#D9D9D9",
              },
              links: {
                blink: false,
                color: "random",
                consent: false,
                enable: true, // Enable links specifically for this central particle
                distance: 400, // Greater distance to connect with many nodes
                opacity: 0.5,
                width: 2,
              },
            },
          },
          {
            position: { x: 65, y: 60 }, // Position the central particle in the middle
            options: {
              move: {
                enable: true,
                speed: 0.25,
              },
              size: {
                value: 4, // Larger size to emphasize central particle
              },
              color: {
                value: "#D9D9D9",
              },
              links: {
                enable: true, // Enable links specifically for this central particle
                distance: 400, // Greater distance to connect with many nodes
                opacity: 0.5,
                blink: false,
                color: "random",
                consent: false,
                width: 2,
              },
            },
          },
          {
            position: { x: 40, y: 60 }, // Position the central particle in the middle
            options: {
              move: {
                enable: true,
                speed: 0.25,
              },
              size: {
                value: 4, // Larger size to emphasize central particle
              },
              color: {
                value: "#D9D9D9",
              },
              links: {
                enable: true, // Enable links specifically for this central particle
                distance: 400, // Greater distance to connect with many nodes
                opacity: 0.5,
                blink: false,
                color: "random",
                consent: false,
                width: 2,
              },
            },
          },
          {
            position: { x: 60, y: 35 }, // Position the central particle in the middle
            options: {
              move: {
                enable: true,
                speed: 0.25,
              },
              size: {
                value: 4, // Larger size to emphasize central particle
              },
              color: {
                value: "#D9D9D9",
              },
              links: {
                enable: true, // Enable links specifically for this central particle
                distance: 400, // Greater distance to connect with many nodes
                opacity: 0.5,
                blink: false,
                color: "random",
                consent: false,
                width: 2,
              },
            },
          },
          {
            position: { x: 10, y: 80 }, // Position the central particle in the middle
            options: {
              move: {
                enable: true,
                speed: 0.25,
              },
              size: {
                value: 4, // Larger size to emphasize central particle
              },
              color: {
                value: "#D9D9D9",
              },
              links: {
                enable: true, // Enable links specifically for this central particle
                distance: 400, // Greater distance to connect with many nodes
                opacity: 0.5,
                blink: false,
                color: "random",
                consent: false,
                width: 2,
              },
            },
          },
          {
            position: { x: 90, y: 85 }, // Position the central particle in the middle
            options: {
              move: {
                enable: true,
                speed: 0.25,
              },
              size: {
                value: 4, // Larger size to emphasize central particle
              },
              color: {
                value: "#D9D9D9",
              },
              links: {
                enable: true, // Enable links specifically for this central particle
                distance: 400, // Greater distance to connect with many nodes
                opacity: 0.5,
                blink: false,
                color: "random",
                consent: false,
                width: 2,
              },
            },
          },
          {
            position: { x: 90, y: 10 }, // Position the central particle in the middle
            options: {
              move: {
                enable: true,
                speed: 0.25,
              },
              size: {
                value: 4, // Larger size to emphasize central particle
              },
              color: {
                value: "#D9D9D9",
              },
              links: {
                enable: true, // Enable links specifically for this central particle
                distance: 400, // Greater distance to connect with many nodes
                opacity: 0.5,
                blink: false,
                color: "random",
                consent: false,
                width: 2,
              },
            },
          },
          {
            position: { x: 50, y: 85 }, // Position the central particle in the middle
            options: {
              move: {
                enable: true,
                speed: 0.25,
              },
              size: {
                value: 4, // Larger size to emphasize central particle
              },
              color: {
                value: "#D9D9D9",
              },
              links: {
                enable: true, // Enable links specifically for this central particle
                distance: 400, // Greater distance to connect with many nodes
                opacity: 0.5,
                blink: false,
                color: "random",
                consent: false,
                width: 2,
              },
            },
          },
        ],
      },
    },
  ],
};

export default particleConfig;
