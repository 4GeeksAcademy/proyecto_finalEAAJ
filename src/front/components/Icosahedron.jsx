import React, { useEffect, useRef } from "react";

export const Icosahedron = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
            alert("Tu navegador es demasiado antiguo, la animación no funcionará");
            return;
        }

        const phi = (1 + Math.sqrt(5)) / 2;
        let lumiere = [0, 40, 70];
        let sommets = [];
        let faces = [];
        let axeRotation = [0, 1, 0.5];

        function produitScalaire(a, b) {
            return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
        }
        function norme(v) {
            return Math.sqrt(produitScalaire(v, v));
        }
        function cosinus(v, w) {
            return produitScalaire(v, w) / (norme(v) * norme(w));
        }
        function matriceRotation(v, t) {
            let x = v[0] / norme(v);
            let y = v[1] / norme(v);
            let z = v[2] / norme(v);
            let c = Math.cos(t);
            let s = Math.sin(t);
            return [
                [c + x * x * (1 - c), x * y * (1 - c) - z * s, x * z * (1 - c) + y * s],
                [y * x * (1 - c) + z * s, c + y * y * (1 - c), y * z * (1 - c) - x * s],
                [z * x * (1 - c) - y * s, z * y * (1 - c) + x * s, c + z * z * (1 - c)]
            ];
        }
        function produitMV(A, v) {
            let w = [0, 0, 0];
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    w[i] += A[i][j] * v[j];
                }
            }
            return w;
        }

        // Variables para adaptarse al tamaño
        let centerX, centerY, scale;
        function updateSize() {
            const size = Math.min(window.innerWidth, window.innerHeight) * 0.15;
            canvas.width = size;
            canvas.height = size;
            centerX = canvas.width / 2;
            centerY = canvas.height / 2;
            scale = size / 4;
        }
        updateSize();
        window.addEventListener("resize", updateSize);

        function rendu(v) {
            return [
                centerX + v[0] * scale,
                centerY - v[1] * scale
            ];
        }

        function polygone(context, color, points) {
            if (points.length <= 2) return;
            context.fillStyle = color;
            context.beginPath();
            context.moveTo(points[0][0], points[0][1]);
            for (let i = 1; i < points.length; i++) {
                context.lineTo(points[i][0], points[i][1]);
            }
            context.fill();
        }

        function dessinerFace(i) {
            let s1 = faces[i][0];
            let s2 = faces[i][1];
            let s3 = faces[i][2];
            let points = [];
            let normale = [
                sommets[s1][0] + sommets[s2][0] + sommets[s3][0],
                sommets[s1][1] + sommets[s2][1] + sommets[s3][1],
                sommets[s1][2] + sommets[s2][2] + sommets[s3][2]
            ];
            if (normale[2] > 0) {
                let intensite = cosinus(normale, lumiere);
                intensite = Math.max(0.2 + intensite * 0.9, 0.1);
                points = [rendu(sommets[s1]), rendu(sommets[s2]), rendu(sommets[s3])];
                polygone(ctx, `rgb(${intensite * 183},${intensite * 255},${intensite * 0})`, points);
            }
        }

        // Crear vértices
        for (let i = 0; i < 2; i++)
            for (let j = 0; j < 2; j++)
                sommets.push([phi * Math.pow(-1, i), Math.pow(-1, j), 0]);
        for (let i = 0; i < 2; i++)
            for (let j = 0; j < 2; j++)
                sommets.push([0, phi * Math.pow(-1, i), Math.pow(-1, j)]);
        for (let i = 0; i < 2; i++)
            for (let j = 0; j < 2; j++)
                sommets.push([Math.pow(-1, j), 0, phi * Math.pow(-1, i)]);

        faces = [
            [0, 1, 8], [0, 1, 10], [0, 4, 5], [0, 4, 8], [0, 5, 10],
            [1, 6, 7], [1, 6, 8], [1, 7, 10], [2, 3, 9], [2, 3, 11],
            [2, 4, 5], [2, 4, 9], [2, 5, 11], [3, 6, 7], [3, 6, 9],
            [3, 7, 11], [4, 8, 9], [5, 10, 11], [6, 8, 9], [7, 10, 11]
        ];

        let M = matriceRotation(axeRotation, 0.004);

        function mettreAJour() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < sommets.length; i++) {
                sommets[i] = produitMV(M, sommets[i]);
            }
            for (let i = 0; i < faces.length; i++) {
                dessinerFace(i);
            }
            requestAnimationFrame(mettreAJour);
        }
        mettreAJour();

        return () => {
            window.removeEventListener("resize", updateSize);
        };
    }, []);

    return (
        <div className="icosahedron" style={{
            width: "17vh", 
            height: "17vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        }}>
            <canvas ref={canvasRef} id="canvas" style={{
                width: "100%",
                height: "100%"
            }}></canvas>
        </div>
    );
};



/* import React, { useEffect, useRef } from "react";

export const Icosahedron = () => {//Adaptación de "https://codepen.io/damienmegy/pen/MWOErRm"
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
            alert("Tu navegador es demasiado antiguo, la animación no funcionará");
            return;
        }

        const phi = (1 + Math.sqrt(5)) / 2;
        let lumiere = [0, 40, 70];
        let sommets = [];
        let faces = [];
        let axeRotation = [0, -1, -0.5];

        function produitScalaire(a, b) {
            return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
        }

        function norme(v) {
            return Math.sqrt(produitScalaire(v, v));
        }

        function cosinus(v, w) {
            return produitScalaire(v, w) / (norme(v) * norme(w));
        }

        function matriceRotation(v, t) {
            let x = v[0] / norme(v);
            let y = v[1] / norme(v);
            let z = v[2] / norme(v);
            let c = Math.cos(t);
            let s = Math.sin(t);
            return [
                [c + x * x * (1 - c), x * y * (1 - c) - z * s, x * z * (1 - c) + y * s],
                [y * x * (1 - c) + z * s, c + y * y * (1 - c), y * z * (1 - c) - x * s],
                [z * x * (1 - c) - y * s, z * y * (1 - c) + x * s, c + z * z * (1 - c)]
            ];
        }

        function produitMV(A, v) {
            let w = [0, 0, 0];
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    w[i] += A[i][j] * v[j];
                }
            }
            return w;
        }

        function rendu(v) {
            return [100 + v[0] * 50, 100 - v[1] * 50];
        }

        function polygone(context, color, points) {
            if (points.length <= 2) return;
            context.fillStyle = color;
            context.beginPath();
            context.moveTo(points[0][0], points[0][1]);
            for (let i = 1; i < points.length; i++) {
                context.lineTo(points[i][0], points[i][1]);
            }
            context.fill();
        }

        function dessinerFace(i) {
            let s1 = faces[i][0];
            let s2 = faces[i][1];
            let s3 = faces[i][2];
            let points = [];
            let normale = [
                sommets[s1][0] + sommets[s2][0] + sommets[s3][0],
                sommets[s1][1] + sommets[s2][1] + sommets[s3][1],
                sommets[s1][2] + sommets[s2][2] + sommets[s3][2]
            ];
            if (normale[2] > 0) {
                let intensite = cosinus(normale, lumiere);
                intensite = Math.max(0.2 + intensite * 0.9, 0.1);
                points = [rendu(sommets[s1]), rendu(sommets[s2]), rendu(sommets[s3])];
                polygone(ctx, `rgb(${intensite * 183},${intensite * 255},${intensite * 0})`, points);
            }
        }

        for (let i = 0; i < 2; i++)
            for (let j = 0; j < 2; j++)
                sommets.push([phi * Math.pow(-1, i), Math.pow(-1, j), 0]);
        for (let i = 0; i < 2; i++)
            for (let j = 0; j < 2; j++)
                sommets.push([0, phi * Math.pow(-1, i), Math.pow(-1, j)]);
        for (let i = 0; i < 2; i++)
            for (let j = 0; j < 2; j++)
                sommets.push([Math.pow(-1, j), 0, phi * Math.pow(-1, i)]);

        faces = [
            [0, 1, 8], [0, 1, 10], [0, 4, 5], [0, 4, 8], [0, 5, 10],
            [1, 6, 7], [1, 6, 8], [1, 7, 10], [2, 3, 9], [2, 3, 11],
            [2, 4, 5], [2, 4, 9], [2, 5, 11], [3, 6, 7], [3, 6, 9],
            [3, 7, 11], [4, 8, 9], [5, 10, 11], [6, 8, 9], [7, 10, 11]
        ];

        let M = matriceRotation(axeRotation, 0.004);

        function mettreAJour() {
            ctx.clearRect(0, 0, 400, 400);
            for (let i = 0; i < sommets.length; i++) {
                sommets[i] = produitMV(M, sommets[i]);
            }
            for (let i = 0; i < faces.length; i++) {
                dessinerFace(i);
            }
            requestAnimationFrame(mettreAJour);
        }
        mettreAJour();
    }, []);

    return (
        <div className="icosahedron container-fluid d-flex justify-content-center align-items-center">
            <canvas ref={canvasRef} id="canvas" width="200vh" height="200vh"></canvas>
        </div>
    );
}; */



/* export const Icosahedron = () => {//Adaptación de "https://codepen.io/damienmegy/pen/MWOErRm"
    // constantes:
    const phi = (1+Math.sqrt(5))/2;
    //variables
    let lumiere = [-10,10,20];  //dirección de la iluminación
    let sommets = new Array();
    let faces = new Array();
    let axeRotation = [1,1,.5]
    //let matriceProj = new Array();
    //let projections = new Array();
    // Canvas
    //let candiv = document.getElementById("candiv");
    let canvas = document.getElementById("canvas");
    if ( typeof(canvas.getContext) != "function" ) {
            alert("Tu navegador es demasiado antiguo, la animación no funcionará");
        } 
    let ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    //- - - - - - - - - - - - - - - - - - 
    //- - - - Álgebra euclidiana
    //- - - - - - - - - - - - - - - - - -

    function produitScalaire(a,b){
        let p=0;
        for(let i=0;i<3;i++){
            p=p+a[i]*b[i];
        }
        return(p);
    }

    function norme(v){//devuelve la norma de un vector
        return(Math.sqrt(produitScalaire(v,v)));
    }

    function cosinus(v,w){// devuelve el coseno del ángulo entre dos vectores
        return(produitScalaire(v,w)/(norme(v)*norme(w)));
    }

    function distanceCarre(a,b){
        let v=[0,0,0];
        for(let i=0;i<3;i++){v[i]=b[i]-a[i];}
        return(produitScalaire(v,v));
    }
    function distance(a,b){
        return(Math.sqrt(distanceCarre(a,b)));
    }

    function matriceRotation(v,t){
        let M=new Array();
        let x=v[0]/norme(v);
        let y=v[1]/norme(v);
        let z=v[2]/norme(v);
        let c = Math.cos(t);
        let s = Math.sin(t);
        M=[	[c+x*x*(1-c),x*y*(1-c)-z*s, x*z*(1-c)+y*s],
            [y*x*(1-c)+z*s,c+y*y*(1-c),y*z*(1-c)-x*s],
            [z*x*(1-c)-y*s,z*y*(1-c)+x*s,c+z*z*(1-c)]];
        return(M);
    }

    function produitMatriciel(A, B) {
        let rows = A.length;  var mid = B.length;  var cols = B[0].length;
        let C = new Array(rows);
        for (let i=0 ; i<rows ; i++ ) {
            let vec = new Array(cols);
            for (let j=0 ; j<cols ; j++ ) {
                vec[j] = 0;
                for (let k=0 ; k<mid ; k++ )
                    vec[j] += A[i][k]*B[k][j];
            }
            C[i] = vec;
        }
        return C;
    }

    function produitMV(A,v){
    let w=[0,0,0];
    for(let i=0;i<3;i++){
        for(let j=0;j<3;j++){
        w[i]+= A[i][j]*v[j]
        }
    }
    return(w);
    }

    //- - - - - - - - - - - - - - - - - -
    //- - - - cálculos y visualización
    //- - - - - - - - - - - - - - - - - -


    function rendu(v){// toma un punto en 3d y devuelve una coordenada en 2d
    let P= new Array(2);
    // para un lienzo 400*400
    P[0]=Math.round(200+v[0]*100);
    P[1]=Math.round(200-v[1]*100); //el lienzo cuenta las ordenadas hacia abajo
    return P;
    }

    function dessinerFace(i){
    // los tres números de los vértices
    let s1=faces[i][0];
    let s2=faces[i][1];
    let s3=faces[i][2];
    let points=new Array();//tabla que contiene los tres puntos calculados de cada cara
    let intensite=0;
    let normale=[0,0,0];
    
    // cálculo de la normal a cada cara: simplemente sumamos los puntos
    for(let l=0;l<3;l++){
        normale[l]=sommets[s1][l]+sommets[s2][l]+sommets[s3][l];
    }
    
    if(normale[2]>0){// si la cara es visible:
        intensite=cosinus(normale,lumiere);///intensidad difundida por la cara
        intensite=Math.max(.2+intensite*0.9,0.1);
        // calculamos las coordenadas en el lienzo:
        points=[rendu(sommets[s1]),rendu(sommets[s2]),rendu(sommets[s3])];
        // dibujamos la cara en el lienzo:
        polygone(ctx,"rgb("+intensite*183+","+intensite*255+","+intensite*0+")",points);
    }
    }
    //rgb(183, 255, 0) o rgb(123, 255, 0)
    function polygone(context,color,points){
    // puntos: tabla de tablas [x,y] 
    // color: string ej: "rgb(183, 255, 0)"
    if(points.length<=2) return;
    context.fillStyle = color;
    context.beginPath();
    context.moveTo(points[0][0],points[0][1]);
    for(let i=1;i<points.length;i++){
        context.lineTo(points[i][0],points[i][1]);
    }
    context.fill();
    }

    function bougerLumiere(evt){
    let mx = evt.clientX - window.innerWidth/2;
    let my = window.innerHeight/2 - evt.clientY;
    lumiere=[mx,my,550];
    }

    function mettreAJour() {
            ctx.clearRect(0,0,400,400);
        // hacemos girar el icosaedro:
        for(let i=0;i<sommets.length;i++){
        sommets[i]=produitMV(M,sommets[i]);
        }
        // dibujamos:
            for (let i=0 ; i<20 ; i++ ) {
            dessinerFace(i);
        }
            window.setTimeout(mettreAJour, 40);
    } 

    // - - - - - - - - - - - -
    // INICIALIZACIÓN DE LOS VÉRTICES
    // - - - - - - - - - - - -
    for(let i=0 ; i<2 ; i++)
        for(let j=0 ; j<2 ; j++)
            sommets.push([phi*Math.pow((-1),i),Math.pow((-1),j),0]);
    for(let i=0 ; i<2 ; i++)
        for(let j=0 ; j<2 ; j++)
            sommets.push([0,phi*Math.pow((-1),i),Math.pow((-1),j)]);
    for(let i=0 ; i<2 ; i++)
        for(let j=0 ; j<2 ; j++)
            sommets.push([Math.pow((-1),j),0,phi*Math.pow((-1),i),]);
    // - - - - - - - - - - - -
    // INICIALIZACIÓN DE LAS CARAS
    // - - - - - - - - - - - -
    faces=[[0,1,8],[0,1,10],[0,4,5],[0,4,8],[0,5,10],[1,6,7],[1,6,8],[1,7,10],[2,3,9],[2,3,11],[2,4,5],[2,4,9],[2,5,11],[3,6,7],[3,6,9],[3,7,11],[4,8,9],[5,10,11],[6,8,9],[7,10,11]];

    let M = matriceRotation(axeRotation,0.04);

    mettreAJour();
  
    return (
    <div className="icosahedron container-fluid d-flex justify-content-between align-items-center">
        <style>
            {`.container {
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                text-align: center;
                min-height: 100vh;
            }
            conIco{margin:0}`}
        </style>
        <div className="conIco" onmousemove="bougerLumiere(event)">
            <div className="container">
                <canvas id="canvas" width="400" height="400"></canvas>
            </div>
        </div>
    </div>
  );
}; */
