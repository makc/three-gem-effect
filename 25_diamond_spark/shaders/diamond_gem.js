vs["diamond_gem"]=`


varying vec2 vUv;
varying vec3 Normal;
varying vec3 worldNormal;
varying vec3 vecPos;
varying vec3 viewPos;


void main(){


vUv=uv;
Normal=normal;
worldNormal=(modelMatrix*vec4(normal,0.0)).xyz;
vecPos=(modelMatrix*vec4(position,1.0)).xyz;
viewPos=(modelViewMatrix*vec4(position,1.0)).xyz;
gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);


}


`;


fs["diamond_gem"]=`


varying vec2 vUv;
varying vec3 Normal;
varying vec3 worldNormal;
varying vec3 vecPos;
varying vec3 viewPos;
uniform vec3 color;
uniform vec3 absorbption;
uniform int ray_bounces;
uniform float radius;
uniform samplerCube tCubeMapNormals;
uniform samplerCube envMap;
uniform float envMapIntensity;
uniform mat4 modelMatrix;
uniform mat4 inverseModelMatrix;
uniform float rIndexDelta;
uniform float refractiveIndex;
uniform float normalOffset;
uniform float squashFactor;
uniform float distanceOffset;
uniform float geometryFactor;
uniform vec3 centerOffset;


vec3 BRDF_Specular_GGX_Environment(const in vec3 viewDir,const in vec3 normal,const in vec3 specularColor,const in float roughness){


float dotNV=abs(dot(normal,viewDir));
const vec4 c0=vec4(-1,-0.0275,-0.572,0.022);
const vec4 c1=vec4(1,0.0425,1.04,-0.04);
vec4 r=roughness*c0+c1;
float a004=min(r.x*r.x,exp2(-9.28*dotNV))*r.x+r.y;
vec2 AB=vec2(-1.04,1.04)*a004+r.zw;
return specularColor*AB.x+AB.y;


}


vec4 SampleSpecularReflection(vec4 specularColor,vec3 direction){


direction.x*=-1.0;
direction.z*=-1.0;
vec4 sampleColorRGB=envMapIntensity*textureCube(envMap,direction);
vec3 toneMappedColor=pow(toneMapping(sampleColorRGB.rgb),vec3(1.0/1.0));
return vec4(toneMappedColor,1.0);


}


vec4 SampleSpecularContribution(vec4 specularColor,vec3 direction){


direction=normalize(direction);
direction.x*=-1.0;
direction.z*=-1.0;
vec4 sampleColorRGB=envMapIntensity*textureCube(envMap,direction);
vec3 toneMappedColor=pow(toneMapping(sampleColorRGB.rgb),vec3(1.0/1.0));
return vec4(toneMappedColor,1.0);


}


vec3 intersectSphere(vec3 origin,vec3 direction){


origin-=centerOffset;
direction.y/=squashFactor;
float A=dot(direction,direction);
float B=2.0*dot(origin,direction);
float C=dot(origin,origin)-radius*radius;
float disc=B*B-4.0*A*C;


if(disc>0.0){
disc=sqrt(disc);
float t1=(-B+disc)*geometryFactor/A;
float t2=(-B-disc)*geometryFactor/A;
float t=(t1>t2)?t1:t2;
direction.y*=squashFactor;
return vec3(origin+centerOffset+direction*t);
}


return vec3(0.0);


}


vec3 debugBounces(int count){


vec3 color=vec3(1.0,1.0,1.0);
if(count==1)
color=vec3(0.0,1.0,0.0);
else if(count==2)
color=vec3(0.0,0.0,1.0);
else if(count==3)
color=vec3(1.0,1.0,0.0);
else if(count==4)
color=vec3(0.0,1.0,1.0);
else
color=vec3(0.0,1.0,0.0);
if(count==0)
color=vec3(1.0,0.0,0.0);
return color;


}


vec3 traceRay(vec3 origin,vec3 direction,vec3 normal){


vec3 outColor=vec3(0.0);


// REFLECT / REFRACT RAY ENTERING THE DIAMOND


const float n1=1.0;
const float epsilon=1e-4;
float f0=(2.4-n1)/(2.4+n1);
f0*=f0;
vec3 attenuationFactor=vec3(1.0);
vec3 newDirection=refract(direction,normal,n1/refractiveIndex);
vec3 reflectedDirection=reflect(direction,normal);
vec3 brdfReflected=BRDF_Specular_GGX_Environment(reflectedDirection,normal,vec3(f0),0.0);
vec3 brdfRefracted=BRDF_Specular_GGX_Environment(newDirection,-normal,vec3(f0),0.0);
attenuationFactor*=(vec3(1.0)-brdfRefracted);
outColor+=SampleSpecularReflection(vec4(1.0),reflectedDirection).rgb*brdfReflected;
int count=0;
newDirection=(inverseModelMatrix*vec4(newDirection,0.0)).xyz;
newDirection=normalize(newDirection);
origin=(inverseModelMatrix*vec4(origin,1.0)).xyz;


// RAY BOUNCES


for(int i=0; i<ray_bounces; i++){
vec3 intersectedPos;
intersectedPos=intersectSphere(origin+vec3(epsilon),newDirection);
vec3 dist=intersectedPos-origin;
vec3 d=normalize(intersectedPos-centerOffset);
vec3 mappedNormal=textureCube(tCubeMapNormals,d).xyz;
mappedNormal=2.*mappedNormal-1.;
mappedNormal.y+=normalOffset;
mappedNormal=normalize(mappedNormal);
float r=sqrt(dot(dist,dist));
attenuationFactor*=exp(-r*absorbption);


// REFRACT THE RAY AT FIRST INTERSECTION


vec3 oldOrigin=origin;
origin=intersectedPos-normalize(intersectedPos-centerOffset)*distanceOffset;
vec3 oldDir=newDirection;
newDirection=refract(newDirection,mappedNormal,refractiveIndex/n1);
if(dot(newDirection,newDirection)==0.0){
// TOTAL INTERNAL REFLECTION. CONTINUE INSIDE THE DIAMOND
newDirection=reflect(oldDir,mappedNormal);
//IF THE RAY GOT TRAPPED EVEN AFTER MAX ITERATIONS, SIMPLY SAMPLE ALONG THE OUTGOING REFRACTION
if(i==ray_bounces-1){
vec3 brdfReflected=BRDF_Specular_GGX_Environment(-oldDir,mappedNormal,vec3(f0),0.0);
vec3 d1=(modelMatrix*vec4(oldDir,0.0)).xyz;
outColor+=SampleSpecularContribution(vec4(1.0),d1).rgb*color*attenuationFactor*(vec3(1.0)-brdfReflected);
//outColor=vec3(1.,0.,0.);
//if(d1.y>0.95){
//outColor+=d1.y*vec3(1.,0.,0)*attenuationFactor*(vec3(1.0)-brdfReflected);
//}
}
}
else {
// ADD THE CONTRIBUTION FROM OUTGOING RAY,AND CONTINUE THE REFLECTED RAY INSIDE THE DIAMOND
vec3 brdfRefracted=BRDF_Specular_GGX_Environment(newDirection,-mappedNormal,vec3(f0),0.0);
// OUTGOING(REFRACTED) RAYS CONTRIBUTION
vec3 d1=(modelMatrix*vec4(newDirection,0.0)).xyz;
vec3 colorG=SampleSpecularContribution(vec4(1.0),d1).rgb*(vec3(1.0)-brdfRefracted);
vec3 dir1=refract(oldDir,mappedNormal,(refractiveIndex+rIndexDelta)/n1);
vec3 dir2=refract(oldDir,mappedNormal,(refractiveIndex-rIndexDelta)/n1);
vec3 d2=(modelMatrix*vec4(dir1,0.0)).xyz;
vec3 d3=(modelMatrix*vec4(dir2,0.0)).xyz;
vec3 colorR=SampleSpecularContribution(vec4(1.0),d2).rgb*(vec3(1.0)-brdfRefracted);
vec3 colorB=SampleSpecularContribution(vec4(1.0),d3).rgb*(vec3(1.0)-brdfRefracted);
outColor+=vec3(colorR.r,colorG.g,colorB.b)*color*attenuationFactor;
//outColor=oldDir;
//NEW REFLECTED RAY INSIDE THE DIAMOND
newDirection=reflect(oldDir,mappedNormal);
vec3 brdfReflected=BRDF_Specular_GGX_Environment(newDirection,mappedNormal,vec3(f0),0.0);
attenuationFactor*=brdfReflected;
count++;
}
}
//outColor=debugBounces(count);
return outColor;


}


void main(){


vec3 normalizedNormal=normalize(worldNormal);
vec3 viewVector=normalize(vecPos-cameraPosition);
vec3 color=traceRay(vecPos,viewVector,normalizedNormal);
gl_FragColor=vec4(color.rgb,1.);
#include <tonemapping_fragment>
//#include <encodings_fragment>
//gl_FragColor=textureCube(tCubeMapNormals,normalize(Normal));
//gl_FragColor=textureCube(tCubeMapNormals,reflect(viewVector,normalizedNormal));
//gl_FragColor=vec4(vecPos,1.0);


}


`;
