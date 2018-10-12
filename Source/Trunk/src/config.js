export const apiUrl = 'http://heracles.hiee.us/api';
export const loginUrl = 'http://heracles.hiee.us/oauth/authorize';
export const client_id = 'b905024f-d60d-47cf-b4a4-4c8c701e596b';

export const configParticles = {
    "particles": {
        "number": {
            "value": 69,
            "density": {
                "enable": true,
                "value_area": 696
            }
        },
        "color": {
            "value": "#3498db"
        },
        "shape": {
            "type": "circle",
            "stroke": {
                "width": 0,
                "color": "#000000"
            },
            "polygon": {
                "nb_sides": 6.9
            }
        },
        "opacity": {
            "value": 0.69,
            "random": true,
            "anim": {
                "enable": false,
                "speed": 1,
                "opacity_min": 0.1,
                "sync": false
            }
        },
        "size": {
            "value": 3.69,
            "random": true,
            "anim": {
                "enable": false,
                "speed": 40,
                "size_min": 0.69,
                "sync": false
            }
        },
        "line_linked": {
            "enable": true,
            "distance": 169,
            "color": "#3498db",
            "opacity": 0.5,
            "width": 1
        },
        "move": {
            "enable": true,
            "speed": 3.69,
            "direction": "none",
            "random": true,
            "straight": false,
            "out_mode": "out",
            "bounce": false,
            "attract": {
                "enable": false,
                "rotateX": 600,
                "rotateY": 1200
            }
        }
    },
    "interactivity": {
        "detect_on": "canvas",
        "events": {
            "onhover": {
                "enable": true,
                "mode": "grab"
            },
            "onclick": {
                "enable": true,
                "mode": "repulse"
            },
            "resize": true
        },
        "modes": {
            "grab": {
                "distance": 169,
                "line_linked": {
                    "opacity": 1
                }
            },
            "bubble": {
                "distance": 400,
                "size": 40,
                "duration": 2,
                "opacity": 8,
                "speed": 3
            },
            "repulse": {
                "distance": 196,
                "duration": 0.69
            },
            "push": {
                "particles_nb": 4
            },
            "remove": {
                "particles_nb": 2
            }
        }
    },
    "retina_detect": true
};
