"use strict"


// ____________________ »— –€ ¿ÀÃ¿«¿ ____________________


function diamond_spark_generate(parent,name){


let geometry=new THREE.InstancedBufferGeometry();
geometry.setAttribute('position',new THREE.Float32BufferAttribute(new Float32Array([-0.5,0.5,0,-0.5,-0.5,0,0.5,0.5,0,0.5,-0.5,0,0.5,0.5,0,-0.5,-0.5,0]),3));
geometry.setAttribute('uv',new THREE.Float32BufferAttribute(new Float32Array([0,1,0,0,1,1,1,0,1,1,0,0]),2));
geometry.setAttribute('offset',new THREE.InstancedBufferAttribute(new Float32Array(),3));
geometry.setAttribute('scale',new THREE.InstancedBufferAttribute(new Float32Array(),2));
geometry.setAttribute('intensity',new THREE.InstancedBufferAttribute(new Float32Array(),1));
geometry.setAttribute('frame',new THREE.InstancedBufferAttribute(new Float32Array(),4));
geometry.setAttribute('texture',new THREE.InstancedBufferAttribute(new Float32Array(),1));


mat[name]=new THREE.ShaderMaterial({


uniforms:{
map:{value:[tex["diamond_spark_1"],tex["diamond_spark_2"]]},
screenTexture:{type:"t",value:composer.renderTarget1.texture},
noiseTexture:{type:"t",value:tex["diamond_spark_noise"]},
diamond_modelMatrix:{type:"m4",value:parent.matrix}
},
vertexShader:vs["diamond_spark"],
fragmentShader:fs["diamond_spark"],
transparent:true,
depthTest:false,
depthWrite:false,
blending:THREE.AdditiveBlending


});


mesh[name]=new THREE.Mesh(geometry,mat[name]);
mesh[name].frustumCulled=false;
scene_2.add(mesh[name]);


diamond_spark_update(name);


}


// ____________________ DIAMOND SPARK UPDATE ____________________


function diamond_spark_update(name){


let particles=[];


var max_1=particles_diamond_spark_a.length;
particles.length=max_1;
for(var n=0;n<max_1;n++){
particles[n]=particles_diamond_spark_a[n];
}

var count=particles.length;
var item=camera.position;
var x=item.x;
var y=item.y;
var z=item.z;


for(var n=0;n<count;n++){
var item=particles[n].offset;
particles[n].d=Math.sqrt(Math.pow((x-item[0]),2)+Math.pow((y-item[1]),2)+Math.pow((z-item[2]),2));
}


particles.sort((a,b)=>b.d-a.d);


var offset=new Float32Array(count*3);
var scale=new Float32Array(count*2);
var intensity=new Float32Array(count);
var frame=new Float32Array(count*4);
var texture=new Float32Array(count);


for(var n=0;n<count;n++){


// 1 VALUE
var item=particles[n];
texture[n]=item.texture;
intensity[n]=item.intensity;


// 2 VALUE
var p=n*2;
var one=p+1;
var i_scale=item.scale;
scale[p]=i_scale[0];
scale[one]=i_scale[1];


// 3 VALUE
var p=n*3;
var one=p+1;
var two=p+2;
var i_offset=item.offset;
offset[p]=i_offset[0];
offset[one]=i_offset[1];
offset[two]=i_offset[2];


// 4 VALUE
var p=n*4;
var one=p+1;
var two=p+2;
var three=p+3;
var i_frame=item.frame;
frame[p]=i_frame[0];
frame[one]=i_frame[1];
frame[two]=i_frame[2];
frame[three]=i_frame[3];


}


var item=mesh[name].geometry.attributes;
item.offset=new THREE.InstancedBufferAttribute(offset,3).setUsage(THREE.StreamDrawUsage);
item.scale=new THREE.InstancedBufferAttribute(scale,2).setUsage(THREE.StreamDrawUsage);
item.intensity=new THREE.InstancedBufferAttribute(intensity,1).setUsage(THREE.StreamDrawUsage);
item.frame=new THREE.InstancedBufferAttribute(frame,4).setUsage(THREE.StreamDrawUsage);
item.texture=new THREE.InstancedBufferAttribute(texture,1).setUsage(THREE.StreamDrawUsage);


mesh[name].geometry._maxInstanceCount=count;
particles_diamond_spark_a=[];


}


// ____________________ DIAMOND SPARK ADD ____________________


function diamond_spark_add(child,settings){


let max=settings.sparks_amount;
let intensity=settings.sparks_intensity;
let scale=settings.sparks_scale;


//  ÀŒÕ»–”≈Ã √≈ŒÃ≈“–»ﬁ
let world_geometry=child.geometry.clone();
// —“¿¬»Ã Ã»–Œ¬Œ… –¿«Ã≈– √≈ŒÃ≈“–»», ◊“Œ¡€ «Õ¿“‹ Ã»–Œ¬€≈ «Õ¿◊≈Õ»ﬂ boundingSphere
// œŒ—À≈ œ–»Ã≈Õ≈Õ»ﬂ world_geometry.scale(wscale), boundingSphere » boundingBox ”∆≈ œŒƒ—◊»“¿À»—‹ ¿¬“ŒÃ¿“»◊≈— »
let wscale={x:1,y:1,z:1};
child.getWorldScale(wscale);
world_geometry.scale(wscale.x,wscale.y,wscale.z);


let volume=world_geometry.boundingSphere.radius;
let item=world_geometry.boundingSphere.center;


// —“¿¬»Ã Õ¿◊¿ÀŒ À”◊¿ ¬ ÷≈Õ“– Œ¡⁄≈ “¿
vector_1.set(item.x,item.y,item.z);
// “–¿Õ—‘Œ–Ã»–”≈Ã À”◊ œŒ Ã»–Œ¬Œ… Ã¿“–»÷≈ Œ¡⁄≈ “¿
vector_1.applyMatrix4(child.matrixWorld);
raycaster.ray.origin.set(vector_1.x,vector_1.y,vector_1.z);


if(max==1){
let x=vector_1.x,y=vector_1.y,z=vector_1.z;
vector_1.x=x+(Math.random()-0.5)*volume/5;
vector_1.y=y+(Math.random()-0.5)*volume/5;
vector_1.z=z+(Math.random()-0.5)*volume/5;
let scale_x=(Math.random()*volume+volume*1.5)*scale;
let scale_y=scale_x;
particles_diamond_spark_a.push({offset:[vector_1.x,vector_1.y,vector_1.z],scale:[scale_x,scale_y],intensity:intensity,frame:[1,1,0,0],texture:(Math.floor(Math.random()*2))});
}
else{


for(let n=0;n<max;n++){


// œ”— ¿≈Ã À”◊ ¬ –¿«Õ€≈ —“Œ–ŒÕ€ » ƒŒ¡¿¬Àﬂ≈Ã »— –€ ¬ Ã≈—“≈ œ≈–≈—≈◊≈Õ»ﬂ


while(true){
vector_1.set(Math.random()-0.5,Math.random()-0.5,Math.random()-0.5).normalize();
raycaster.ray.direction.set(vector_1.x,vector_1.y,vector_1.z);
let hit=raycaster.intersectObject(child);
if(hit.length>0){
vector_1=hit[0].point;
break;
}
}


let scale_x=(Math.random()*volume+volume*1.5)*scale;
let scale_y=scale_x;
particles_diamond_spark_a.push({offset:[vector_1.x,vector_1.y,vector_1.z],scale:[scale_x,scale_y],intensity:intensity,frame:[1,1,0,0],texture:(Math.floor(Math.random()*2))});


}


}


child.material.side=THREE.FrontSide;


}
