// CORRECTION TONEMAPPINGA SO THE MATERIAL IS NOT TOO SHINE https://discourse.threejs.org/t/srgb-encoding-as-a-postprocess-pass/12278/15
// https://discourse.threejs.org/t/effect-composer-gamma-output-difference/12039/14


(function(){


const correction={


uniforms:{
"tDiffuse":{value:null},
"color":{value:[0,0,0]},
"saturation":{value:0},
"vibrance":{value:0},
gamma:{value:1},
"brightness":{value:0},
"contrast":{value:0}
},
vertexShader:`


varying vec2 vUv;


void main(){


vUv=uv;
gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);


}`,


fragmentShader:`


uniform sampler2D tDiffuse;
varying vec2 vUv;
uniform vec3 color; // COLOR
uniform float saturation; // SATURATION
uniform float vibrance; // RESONANT COLOR
uniform float gamma; // GAMMA
uniform float brightness; // BRIGHTNESS
uniform float contrast; // CONTRAST


void main(){


gl_FragColor=texture2D(tDiffuse,vUv);
// A PIECE OF CODE FROM GammaCorrectionShader, I.E. FUNCTION LinearTosRGB RETURNS THE NORMAL GAM FOR renderer.outputEncoding=THREE.sRGBEncoding; WHEN USING EffectComposer
gl_FragColor=vec4(mix(pow(gl_FragColor.rgb,vec3(0.41666))*1.055-vec3(0.055),gl_FragColor.rgb*12.92,vec3(lessThanEqual(gl_FragColor.rgb,vec3(0.0031308)))),1.0);


//gl_FragColor.rgb+=color;


float luminance=dot(gl_FragColor.rgb,vec3(0.2125,0.7154,0.0721));
vec3 intensity=vec3(luminance);
gl_FragColor.rgb=mix(intensity,gl_FragColor.rgb,saturation);

/*
float average=(gl_FragColor.r+gl_FragColor.g+gl_FragColor.b)/3.0;
float mx=max(gl_FragColor.r,max(gl_FragColor.g,gl_FragColor.b));
float amt=(mx-average)*(-3.0*vibrance);
gl_FragColor.rgb=mix(gl_FragColor.rgb,vec3(mx),amt);
*/

gl_FragColor.rgb=pow(gl_FragColor.rgb,vec3(gamma));


//gl_FragColor.rgb+=brightness;


gl_FragColor.rgb=(gl_FragColor.rgb-0.5)/(1.0-contrast)+0.5;
//if(contrast>0.0){ gl_FragColor.rgb=(gl_FragColor.rgb-0.5)/(1.0-contrast)+0.5; }
//else{ gl_FragColor.rgb=(gl_FragColor.rgb-0.5)*(1.0+contrast)+0.5; }


}`


};


THREE.correction=correction;


})();
