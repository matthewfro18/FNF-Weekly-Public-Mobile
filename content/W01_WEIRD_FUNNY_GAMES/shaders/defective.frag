precision mediump float; // Use medium precision for mobile compatibility

uniform sampler2D iChannel0; // Texture uniform
varying vec2 uv; // Varying texture coordinates from the vertex shader

uniform float iTime;
uniform vec2 iResolution; // Resolution of the screen

const float pi = 3.14159265358979323846;
const float epsilon = 1e-6;
const float fringeExp = 2.3;
const float fringeScale = 0.005;
const float distortionExp = 2.0;
const float distortionScale = 0.2;
const float startAngle = 1.23456 + pi; // Tweak to get different fringe color
const float angleStep = pi * 2.0 / 3.0; // Space samples every 120 degrees

void main() {
    vec2 baseUV = uv; // Normalized coordinates
    vec2 fromCentre = baseUV - vec2(0.5, 0.5); // Offset from center

    // Correct for aspect ratio
    fromCentre.y *= iResolution.y / iResolution.x;

    float radius = length(fromCentre);
    fromCentre = radius > epsilon ? (fromCentre * (1.0 / radius)) : vec2(0);

    // Strength, rotation, fringing, and distortion
    float strength = 1.2;
    float rotation = 2.0 * pi;
    float fringing = fringeScale * pow(radius, fringeExp) * strength;
    float distortion = distortionScale * pow(radius, distortionExp) * strength;

    // Distorted UV coordinates
    vec2 distortUV = baseUV - fromCentre * distortion;

    // Angle-based texture sampling
    float angle = startAngle + rotation;
    vec2 dir = vec2(sin(angle), cos(angle));
    vec4 redPlane = texture2D(iChannel0, distortUV + fringing * dir);
    
    angle += angleStep;
    dir = vec2(sin(angle), cos(angle));
    vec4 greenPlane = texture2D(iChannel0, distortUV + fringing * dir);
    
    angle += angleStep;
    dir = vec2(sin(angle), cos(angle));
    vec4 bluePlane = texture2D(iChannel0, distortUV + fringing * dir);
    
    // Output color
    gl_FragColor = vec4(redPlane.r, greenPlane.g, bluePlane.b, 1.0);
}
