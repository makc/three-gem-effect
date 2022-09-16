vs["diamond_normal"]=`


varying vec3 vNormal;


void main(){


vNormal=normal;
gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);


}


`;


fs["diamond_normal"]=`


varying vec3 vNormal;


void main(){


vec3 color=normalize(vNormal);
color=color*0.5+0.5;
gl_FragColor=vec4(color.x,color.y,color.z,1.0);


}


`;
