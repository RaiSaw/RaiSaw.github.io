const header = document.querySelector('.navbar');

window.onscroll = function () {
    var top = window.scrollY;
    if (top>=100){
        header.classList.add('navbarDark');
    }
    else{
        header.classList.remove('navbarDark');
    }
}
const canvas1 = document.getElementById('canvas1');
const ctx1 = canvas1.getContext('2d');
canvas1.width = window.innerWidth;
canvas1.height = window.innerHeight;

const particlesArray = [];
let hue = 0;

window.addEventListener('load',animate);

window.addEventListener('resize', function(){
    canvas1.width = window.innerWidth;
    canvas1.height = window.innerHeight;
});

const mouse ={
    x: undefined,
    y: undefined,
}

canvas1.addEventListener('click', function(event){
    mouse.x = event.x;
    mouse.y = event.y;
    for (let i = 0; i < 10; i++){
        particlesArray.push(new Particle());
    }
});

canvas1.addEventListener('mousemove', function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
    for (let i = 0; i < 10; i++){
        particlesArray.push(new Particle());
    }
})

class Particle{
    constructor(){
        this.x = mouse.x;
        this.y = mouse.y;
        this.size = Math.random() * 15 + 1;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
        this.color = 'hsl(' + hue + ', 100%, 50%)';
    }
    update(){
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.size > 0.2) this.size -= 0.1;
    }
    draw(){
        ctx1.fillStyle = this.color;
        ctx1.beginPath();
        ctx1.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx1.fill();
    }
}
function handleParticles(){
    for (let i = 0; i< particlesArray.length; i++){
        particlesArray[i].update();
        particlesArray[i].draw();
        for (let j = i; j< particlesArray.length; j++) {
            const dx = particlesArray[i].x - particlesArray[j].x;
            const dy = particlesArray[i].y - particlesArray[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 100){
                ctx1.beginPath();
                ctx1.strokeStyle = particlesArray[i].color;
                ctx1.lineWidth = particlesArray[i].size;
                ctx1.moveTo(particlesArray[i].x, particlesArray[i].y);
                ctx1.lineTo(particlesArray[j].x, particlesArray[j].y);
                ctx1.closePath();
            }
        }
        if (particlesArray[i].size <= 0.3){
            particlesArray.splice(i, 1);
            i--;
        }
    }
}
function animate(){
    ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
    handleParticles();
    hue++;

    requestAnimationFrame(animate)
}