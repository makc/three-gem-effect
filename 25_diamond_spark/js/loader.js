"use strict"


//____________________ ��������� ������� � ������� ____________________


var loader_textures_show=1; // 0 - �� ���������� ������ ������� � �������, 1 - ����������
var loader_models_show=1; // 0 - �� ���������� ������ ������� � �������, 1 - ����������
var loader_sounds_show=1; // 0 - �� ���������� ������ ������ � �������, 1 - ����������


var loader_total=0; // ������� ���� ���������
var loader_loaded=0; // ������� ���������
var loader_textures_loaded=0; // ������� ��������� �������
var loader_models_loaded=0; // ������� ��������� �������
var loader_sounds_loaded=0; // ������� ��������� ������


//____________________ �������� �������� ____________________


var loadingManager=new THREE.LoadingManager();


//____________________ �ר���� �������� ____________________


loadingManager.onProgress=function(item,loaded,total){


var found=0;


if(item.match(/(\.jpe?g($|\?)|\.png($|\?)|\.gif($|\?)|\.bmp($|\?)|\.dds($|\?)|\.hdr($|\?))/gi)){
found=1;
loader_textures_loaded++;
if(loader_textures_show){ console.log("%c"+item,"font-weight:bold;color:#004090"); }
}


if(item.match(/(\.obj($|\?)|\.fbx($|\?)|\.gltf($|\?)|\.glb($|\?)|\.bin($|\?))/gi)){
found=1;
loader_models_loaded++;
if(loader_models_show){ console.log("%c"+item,"font-weight:bold;color:#448A44"); }
}


if(item.match(/(\.ogg($|\?)|\.mp3($|\?)|\.wav($|\?))/gi)){
found=1;
loader_sounds_loaded++;
if(loader_sounds_show){ console.log("%c"+item,"font-weight:bold;color:#A73CEE"); }
}


if(found==0){ console.log("%c �������� ������ ����� �����: "+item+" ","background:#ff0000;color:#ffffff"); return; }


loader_loaded++;
loader_total=total;


};


//____________________ ��������� �������� �������� ������, ����� �������� ���������� ��������� ____________________


window.onload=function(){ loader_check(); }


//____________________ �������� �������� ������ ____________________


function loader_check(){


document.getElementById("loading_amount").innerHTML=loader_loaded+"/"+loader_total;


if(loader_total==loader_loaded){
console.log("%c �������: "+loader_textures_loaded+" ","background:#222;font-weight:bold;color:#bada55");
console.log("%c �������: "+loader_models_loaded+" ","background:#222;font-weight:bold;color:#bada55");
console.log("%c ������: "+loader_sounds_loaded+" ","background:#222;font-weight:bold;color:#bada55");
console.log("%c --> �Ѩ ��������� <-- ","background:#222;font-weight:bold;color:#bada55;");
init();
return;
}


requestAnimationFrame(loader_check);


}


//____________________ ����� �������� ������ ������������� ____________________


function meshes_frustum_visible(item,mode){


if(mode==1){
item.traverse(function(child){
if(child.isMesh){
child.last_visible=child.visible;
child.visible=true;
child.last_frustumCulled=child.frustumCulled;
child.frustumCulled=false;
}
});
}
else{
item.traverse(function(child){
if(child.isMesh){
child.visible=child.last_visible;
child.frustumCulled=child.last_frustumCulled;
delete child.visible;
delete child.last_frustumCulled;
}
});
}


}


function init(){


diamond_generate();
// ������ ���������, ����� �Ѩ ������ ����� � ������ � �� ���������


meshes_frustum_visible(scene,1);
meshes_frustum_visible(scene_2,1);
renderer.render(scene,camera);
renderer.render(scene_2,camera);
meshes_frustum_visible(scene,2);
meshes_frustum_visible(scene_2,2);


document.getElementById("loading").style.display="none";
loop();


}
