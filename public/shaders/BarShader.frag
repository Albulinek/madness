// fragment shader code
precision mediump float;

uniform sampler2D uMainSampler; // The texture of the mask
uniform vec4 uColor; // The color of the bar

varying vec2 outTexCoord;

void main() {
    vec4 mask = texture2D(uMainSampler, outTexCoord);
    float gray = (mask.r + mask.g + mask.b) / 3.0; // convert to grayscale
    gl_FragColor = mix(uColor, vec4(0.0, 0.0, 0.0, 1.0), gray); // mix based on grayscale value
}
