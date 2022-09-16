vs["diamond_spark"]=`


attribute vec3 offset;
attribute vec2 scale;
attribute float intensity;
attribute vec4 frame;
attribute float texture;
varying vec2 vUv;
varying vec4 vFrame;
varying float tex_num;
varying float vIntensity;
varying vec4 sparkleProjectedCentre;
vec3 localUpVector=vec3(0.0,1.0,0.0);
uniform mat4 diamond_modelMatrix;


void main(){


vUv=uv;
tex_num=texture;
vFrame=frame;
vIntensity=intensity;


vec3 vOffset=(diamond_modelMatrix*vec4(offset,1.0)).xyz;


vec3 posvector=normalize(vOffset+cameraPosition);
vec3 nvOffset=normalize(vec3(vOffset.x+1.0,vOffset.y+1.0,vOffset.z+1.0));
float svOffset=abs(nvOffset.x+nvOffset.y+nvOffset.z);
float angle=sin(posvector.x+posvector.y+posvector.z)*(svOffset*4.0)+svOffset*347.0;
vec3 vRotated=vec3(position.x*scale.x*cos(angle)-position.y*scale.y*sin(angle),position.y*scale.y*cos(angle)+position.x*scale.x*sin(angle),position.z);


vec3 vPosition;


vec3 vLook=normalize(cameraPosition-vOffset);
vec3 vRight=normalize(cross(vLook,localUpVector));
vec3 vUp=normalize(cross(vLook,vRight));
vPosition=vRight*vRotated.x+vUp*vRotated.y+vLook*vRotated.z;


gl_Position=projectionMatrix*modelViewMatrix*vec4(vPosition+vOffset,1.0);


sparkleProjectedCentre=projectionMatrix*modelViewMatrix*vec4(vOffset,1.0);


}


`;


fs["diamond_spark"]=`


varying vec2 vUv;
varying vec4 sparkleProjectedCentre;
varying vec4 vFrame;
varying float tex_num;
varying float vIntensity;
const int count=2;
uniform sampler2D map[count];
uniform sampler2D screenTexture;
uniform sampler2D noiseTexture;
float sparkleTexture;


void main() {


if(tex_num==0.0){ sparkleTexture=texture2D(map[0],vUv/vFrame.xy+vFrame.zw).a; }
else if(tex_num==1.0){ sparkleTexture=texture2D(map[1],vUv/vFrame.xy+vFrame.zw).a; }


// ¡≈–®“ ÷¬≈“ œ» —≈Àﬂ »« — –»ÕÿŒ“¿ —÷≈Õ€,—Œ√À¿—ÕŒ ÷≈Õ“–” —œ–¿…“¿ Õ¿ — –»ÕÿŒ“¿ —÷≈Õ€ » œ–»Ã≈Õﬂ≈“  Œ ¬—≈Ã” —œ–¿…“”


vec2 uv=(sparkleProjectedCentre.xy/sparkleProjectedCentre.w+1.0)*0.5;
vec4 screenColor=texture2D(screenTexture,uv);
float noise=texture2D(noiseTexture,uv).r;
// ”ÃÕŒ∆¿≈Ã Õ≈— ŒÀ‹ Œ –¿«, ◊“Œ¡€ Œ“Œ¡–¿∆¿À»—‹ “ŒÀ‹ Œ Œ◊≈Õ‹ ﬂ– »≈ »— –€
screenColor.xyz*=screenColor.xyz;
screenColor.xyz*=screenColor.xyz;
screenColor.xyz*=screenColor.xyz;
vec4 spriteColor=vec4(1.0)*sparkleTexture*noise*screenColor*vIntensity;
gl_FragColor=spriteColor;


}


`;
