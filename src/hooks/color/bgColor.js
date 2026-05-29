const gradients = {
    purple:
        "bg-[linear-gradient(-45deg,#14001f,#1e1b4b,#111827,#2e1065)]",

    ocean:
        "bg-[linear-gradient(-45deg,#001219,#005f73,#0f172a,#001d3d)]",

    emerald:
        "bg-[linear-gradient(-45deg,#001b1b,#052e2b,#0f172a,#022c22)]",

    crimson:
        "bg-[linear-gradient(-45deg,#1a0000,#3b0a0a,#111111,#2a0f0f)]",

    sunset:
        "bg-[linear-gradient(-45deg,#2b0a0a,#7f1d1d,#451a03,#111827)]",

    cyberBlue:
        "bg-[linear-gradient(-45deg,#020617,#0f172a,#1d4ed8,#312e81)]",

    neonPink:
        "bg-[linear-gradient(-45deg,#1e1b4b,#831843,#111827,#be185d)]",

    aurora:
        "bg-[linear-gradient(-45deg,#001219,#0f766e,#164e63,#312e81)]",

    lava:
        "bg-[linear-gradient(-45deg,#000000,#7f1d1d,#dc2626,#1f2937)]",

    matrix:
        "bg-[linear-gradient(-45deg,#000000,#052e16,#14532d,#022c22)]",

    royal:
        "bg-[linear-gradient(-45deg,#0f172a,#312e81,#4c1d95,#111827)]",

    galaxy:
        "bg-[linear-gradient(-45deg,#020617,#111827,#581c87,#1e3a8a)]",

    ice:
        "bg-[linear-gradient(-45deg,#082f49,#0f172a,#155e75,#164e63)]",

    goldNight:
        "bg-[linear-gradient(-45deg,#111827,#78350f,#451a03,#000000)]",

    toxic:
        "bg-[linear-gradient(-45deg,#111827,#365314,#4d7c0f,#052e16)]",
};


export function getRandomGradient(val = "Midnight") {

    return gradients[val];
}
