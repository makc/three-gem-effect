"use strict"


function diamond_gem_add(child,settings){


diamond_normal_texture=new THREE.WebGLCubeRenderTarget(
settings.quality_px,{
format:THREE.RGBAFormat,
generateMipmaps:false,
magFilter:THREE.NearestFilter,
minFilter:THREE.NearestFilter,
//encoding:THREE.sRGBEncoding
});


// REASSIGN. OTHERWISE EVERYONE WILL HAVE THE SAME TEXTURE


diamond_cube_camera.renderTarget=diamond_normal_texture;


// REDO THE GEOMETRY


let geometry=child.geometry;


if(geometry.transformed){ return; }


vector_1.set(0,0,0);
let vertices=geometry.getAttribute("position").array;
let index=geometry.index;


if(index){


index=index.array;
let max=index.length/3;


for(let n=0;n<max;n+=3){


let one=3*index[n];
let two=3*index[n+1];
let three=3*index[n+2];
vector_2.set(vertices[one],vertices[one+1],vertices[one+2]);
vector_3.set(vertices[two],vertices[two+1],vertices[two+2]);
vector_4.set(vertices[three],vertices[three+1],vertices[three+2]);
vector_3.sub(vector_2);
vector_4.sub(vector_2);
vector_4.cross(vector_3);
vector_1.add(vector_4);


}
}
else{


let max=vertices.length;


for(let n=0;n<max;n+=9){


vector_2.set(vertices[n],vertices[n+1],vertices[n+2]);
vector_3.set(vertices[n+3],vertices[n+4],vertices[n+5]);
vector_4.set(vertices[n+6],vertices[n+7],vertices[n+8]);
vector_3.sub(vector_2);
vector_4.sub(vector_2);
vector_4.cross(vector_3);
vector_4.normalize();
vector_1.add(vector_4);


}


}


vector_1.normalize();
geometry.computeBoundingBox();
geometry.computeBoundingSphere();



matrix4_1.identity();
matrix4_2.identity();
matrix4_3.identity();
matrix4_4.identity();
matrix4_5.identity();
matrix4_6.identity();


let center=geometry.boundingSphere.center;


matrix4_1.makeTranslation(center.x,center.y,center.z);
geometry.center();


let n=0;


while(true){
vector_2.set(vertices[n],vertices[n+1],vertices[n+2]);
vector_2.normalize();
if(Math.abs(vector_1.dot(vector_2)-1)>0.001){ break; }
n+=3;
}


vector_3.crossVectors(vector_2,vector_1);
vector_3.normalize();
vector_2.crossVectors(vector_1,vector_3);
vector_2.normalize();


matrix4_2.elements[0]=vector_2.x;
matrix4_2.elements[1]=vector_2.y;
matrix4_2.elements[2]=vector_2.z;
matrix4_2.elements[3]=0;
matrix4_2.elements[4]=vector_1.x;
matrix4_2.elements[5]=vector_1.y;
matrix4_2.elements[6]=vector_1.z;
matrix4_2.elements[7]=0;
matrix4_2.elements[8]=vector_3.x;
matrix4_2.elements[9]=vector_3.y;
matrix4_2.elements[10]=vector_3.z;
matrix4_2.elements[11]=0;
matrix4_2.elements[12]=0;
matrix4_2.elements[13]=0;
matrix4_2.elements[14]=0;
matrix4_2.elements[15]=1;


matrix4_3.copy(matrix4_2).invert();
geometry.applyMatrix4(matrix4_3);
geometry.computeBoundingSphere();


let radius=geometry.boundingSphere.radius;


matrix4_4.makeScale(radius,radius,radius);


matrix4_5.copy(matrix4_4).invert();
geometry.applyMatrix4(matrix4_5);
matrix4_2.multiply(matrix4_4);
matrix4_1.multiply(matrix4_2);


matrix4_6.compose(child.position,child.quaternion,child.scale);
matrix4_6.multiply(matrix4_1);
matrix4_6.decompose(vector_5,quaternion_1,vector_6);
child.position.copy(vector_5);
child.quaternion.copy(quaternion_1);
child.scale.copy(vector_6);


// CREATE A CUBIC NORMAL MAP OF THE REVERSED GEOMETRY
// ALWAYS SET renderer.autoClear=true TO CREATE A CUBE TEXTURE WITHOUT DISTORTION. OTHERWISE IT WILL BE INCORRECT NORMALS


let last=renderer.autoClear;
renderer.autoClear=true;
diamond_model.geometry=child.geometry.clone();
diamond_model.geometry.center();
diamond_cube_camera.update(renderer,scene_diamond);
diamond_model.geometry.dispose();
renderer.autoClear=false;


child.onBeforeRender=function(){


this.material.uniforms.inverseModelMatrix.value.copy(this.matrixWorld).invert();


};


child.material.dispose();


child.material=new THREE.ShaderMaterial({
uniforms:{
color:{type:"v3",value:{x:1,y:1,z:1}},
tCubeMapNormals:{type:"t",value:diamond_normal_texture.texture},
envMap:{type:"t",value:tex["diamond_envMap"]},
envMapIntensity:{type:"f",value:1},
ray_bounces:{type:"i",value:5},
rIndexDelta:{type:"f",value:0.012},
refractiveIndex:{type:"f",value:2.4},
radius:{type:"f",value:child.geometry.boundingSphere.radius},
normalOffset:{type:"f",value:0},
squashFactor:{type:"f",value:0.98},
distanceOffset:{type:"f",value:0},
geometryFactor:{type:"f",value:0.28},
absorbption:{type:"v3",value:{x:0,y:0,z:0}},
centerOffset:{type:"v3",value:{x:0,y:0,z:0}},
inverseModelMatrix:{type:"m4",value:new THREE.Matrix4}
},
vertexShader:vs["diamond_gem"],
fragmentShader:fs["diamond_gem"],
side:THREE.DoubleSide
});


let item=child.material.uniforms;
for(let i in settings.material){
item[i].value=settings.material[i];
}


}
