"use strict"


//____________________ гюцпсгвхй рейярсп х лндекеи ____________________


var loader_textures_show=1; // 0 - ме нрнапюфюрэ яохянй рейярсп б йнмянке, 1 - нрнапюфюрэ
var loader_models_show=1; // 0 - ме нрнапюфюрэ яохянй лндекеи б йнмянке, 1 - нрнапюфюрэ
var loader_sounds_show=1; // 0 - ме нрнапюфюрэ яохянй гбсйнб б йнмянке, 1 - нрнапюфюрэ


var loader_total=0; // яйнкэйн мюдн гюцпсгхрэ
var loader_loaded=0; // яйнкэйн гюцпсфемн
var loader_textures_loaded=0; // яйнкэйн гюцпсфемн рейярсп
var loader_models_loaded=0; // яйнкэйн гюцпсфемн лндекеи
var loader_sounds_loaded=0; // яйнкэйн гюцпсфемн гбсйнб


//____________________ лемедфеп гюцпсгнй ____________________


var loadingManager=new THREE.LoadingManager();


//____________________ яв╗рвхй гюцпсгнй ____________________


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


if(found==0){ console.log("%c днаюбхрэ тнплюр щрнцн тюикю: "+item+" ","background:#ff0000;color:#ffffff"); return; }


loader_loaded++;
loader_total=total;


};


//____________________ гюосяйюел опнбепйс гюцпсгйх тюикнб, йнцдю ярпюмхжю гюцпсгхряъ онкмнярэч ____________________


window.onload=function(){ loader_check(); }


//____________________ опнбепйю гюцпсгйх тюикнб ____________________


function loader_check(){


document.getElementById("loading_amount").innerHTML=loader_loaded+"/"+loader_total;


if(loader_total==loader_loaded){
console.log("%c рейярсп: "+loader_textures_loaded+" ","background:#222;font-weight:bold;color:#bada55");
console.log("%c лндекеи: "+loader_models_loaded+" ","background:#222;font-weight:bold;color:#bada55");
console.log("%c гбсйнб: "+loader_sounds_loaded+" ","background:#222;font-weight:bold;color:#bada55");
console.log("%c --> бя╗ гюцпсфемн <-- ","background:#222;font-weight:bold;color:#bada55;");
init();
return;
}


requestAnimationFrame(loader_check);


}


//____________________ оняке гюцпсгйх оепбюъ хмхжхюкхгюжхъ ____________________


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
// оепбши пемдепхмц, врнаш бя╗ оноюкн япюгс б оюлърэ х ме рнплнгхкн


meshes_frustum_visible(scene,1);
meshes_frustum_visible(scene_2,1);
renderer.render(scene,camera);
renderer.render(scene_2,camera);
meshes_frustum_visible(scene,2);
meshes_frustum_visible(scene_2,2);


document.getElementById("loading").style.display="none";
loop();


}
