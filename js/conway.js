import * as THREE from "./three.module.js"



const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const live_color = 0xffffff;
const dead_color = 0x000000;



class conway_cell {
    constructor(x, y, z, geometry, visible) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.alive = false;
        this.visible = visible;
        this.neighbors = 0;
        this.mesh = new THREE.Mesh(geometry, 
            new THREE.MeshBasicMaterial({
                color: '#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0'),
                transparent: true,
                opacity: 0.5,
            } ));
        /* this.mesh.add(
            new THREE.LineSegments(
                new THREE.EdgesGeometry(this.mesh.geometry),
                new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 4})
            )
        ); */
        scene.add(this.mesh);
        
        if (!this.visible) {
            this.mesh.visible = false;
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
            this.mesh.visible = true;
        } else {
            this.mesh.visible = false;
        }
    }

    toggle_cell () {
        this.alive = !this.alive;
        this.set_visual();
    }
}

class conway_board {
    constructor (width, height, depth, spacing, geometry) {
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.cells = [];
        this.group = new THREE.Group();
        for (let x = 0; x < width + 2; x++) {
            this.cells[x] = [];
            for (let y = 0; y < height + 2; y++) {
                this.cells[x][y] = [];
                for (let z = 0; z < depth +2; z++) {
                    var visible = !(x == 0 || y == 0 || z == 0 || x == width+1 || y == height+1 || z == depth + 1); // account for the border
                    this.cells[x][y].push(new conway_cell(x, y, z, geometry, visible));
                    this.group.add(this.cells[x][y][z].mesh);
                }
            }
        }
        scene.add(this.group);

    }


    get_cell(x, y, z) {
        return this.cells[x+1][y+1][z+1];
    }

    set_neighbours () {
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                for (let z = 0; z < this.height; z++) {
                    this.get_cell(x, y, z).neighbors = 0;
                    for (let i = -1; i <= 1; i++) {
                        for (let j = -1; j <= 1; j++) {
                            for (let k = -1; k <= 1; k++) {
                                if (i == 0 && j == 0 && k == 0) {
                                    continue;
                                }
                                if (x+i < 0 || x+i >= this.width || y+j < 0 || y+j >= this.height || z+k < 0 || z+k >= this.depth) {
                                    continue;
                                }
                                if (this.get_cell(x+i, y+j, z+k).alive) {
                                    this.get_cell(x, y, z).neighbors++;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    set_visual () {
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                for (let z = 0; z < this.height; z++) {
                this.get_cell(x, y, z).set_visual();
                }
            }
        }
    }

    update() {
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                for (let z = 0; z < this.height; z++) {
                    this.get_cell(x, y, z).update();
                }
            }
        }
        this.set_visual(); // just for now
    }

} 

const geometry = new THREE.BoxGeometry(1, 1, 1);

const board = new conway_board(30, 30, 30, 1, geometry);

// give it an initial state
var init_set = [[4,4,1], [4,5,2], [4,6,3], [5,6,1], [6, 5, 2]]
 
for (const [x, y, z] of init_set) {
    board.get_cell(x, y, z).toggle_cell();
}

board.set_visual();



// board.update();

camera.position.x = 10;
camera.position.y = 10;
camera.position.z = 50;
/* camera.rotateX(Math.PI/10);
camera.rotateY(Math.PI/10);   */



function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

async function run_conway() {
    while (true) {
        renderer.render( scene, camera );
        board.set_neighbours();
        board.update();
        board.group.rotateOnAxis(new THREE.Vector3(1, 1, 0), 0.1);
        await sleep(100);
    }
}


run_conway();





















