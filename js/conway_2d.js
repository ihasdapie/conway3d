import * as THREE from "./three.module.js"
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const live_color = 0x00ff00;
const dead_color = 0x000000;


class conway_cell {
    constructor(x, y, z, geometry, visible) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.alive = false;
        this.visible = visible;
        this.neighbors = 0;
        this.mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial( { color: dead_color, transparent: true } ));
        this.mesh.add(
            new THREE.LineSegments(
                new THREE.EdgesGeometry(this.mesh.geometry),
                new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 4})
            )
        );
        scene.add(this.mesh);
        
        if (!this.visible) {
            this.mesh.visible = false;
            this.mesh.alive = false;
        }

        this.mesh.position.set(x, y, z);
    }

    update() {
        // console.log("init: ", this.x, this.y, this.alive, this.neighbors);
        if (this.neighbors > 3) {
            this.alive = false;
        } else if (this.neighbors < 2) {
            this.alive = false;
        }
        else if (this.neighbors == 3) {
            this.alive = true;
        }
        // console.log(this.x, this.y, this.alive);
    }
    set_visual () {
        if (this.alive) {
            this.mesh.opacity = 1;
            this.mesh.material.color.setHex(live_color);
        } else {
            this.mesh.material.opacity = 0.5;
            this.mesh.material.color.setHex(dead_color);
        }
    }

    toggle_cell () {
        this.alive = !this.alive;
        this.set_visual();
    }
}

class conway_board {
    constructor (width, height, spacing, geometry) {
        this.width = width;
        this.height = height;
        this.cells = [];
        for (let x = 0; x < width + 2; x++) {
            this.cells[x] = [];
            for (let y = 0; y < height + 2; y++) {
                var visible = !(x == 0 || y == 0 || x == width+1 || y == height+1); // account for the border
                this.cells[x].push(new conway_cell(x, y, 0, geometry, visible));
            }
        }

    }


    get_cell(x, y) {
        return this.cells[x+1][y+1];
    }

    set_neighbours () {
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                this.get_cell(x, y).neighbors = 0;
                for (let i = -1; i <= 1; i++) {
                    for (let j = -1; j <= 1; j++) {
                        if (i == 0 && j == 0) {
                            continue;
                        }
                        if (x+i < 0 || x+i >= this.width || y+j < 0 || y+j >= this.height) {
                            continue;
                        }
                        if (this.get_cell(x+i, y+j).alive) {
                            this.get_cell(x, y).neighbors++;
                        }
                    }
                }
            }
        }
    }

    set_visual () {
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                this.get_cell(x, y).set_visual();
            }
        }
    }

    update() {
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                this.get_cell(x, y).update();
            }
        }
        this.set_visual(); // just for now
    }

} 

const geometry = new THREE.BoxGeometry(1, 1, 1);

const board = new conway_board(10, 10, 1, geometry);

// give it an initial state
var init_set = [[4,4], [4,5], [4,6], [5,6], [6, 5]]
 
for (const [x, y] of init_set) {
    board.get_cell(x, y).toggle_cell();
}

board.set_visual();



// board.update();

camera.position.x = 10;
camera.position.y = -5;
camera.position.z = 15;
camera.rotateX(Math.PI/10);
camera.rotateY(Math.PI/10);



function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

async function run_conway() {
    while (true) {
        renderer.render( scene, camera );
        board.set_neighbours();
        board.update();
        await sleep(1000);
    }
}


run_conway();





















