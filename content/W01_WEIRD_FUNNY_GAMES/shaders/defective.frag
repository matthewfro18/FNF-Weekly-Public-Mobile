#version 100
precision mediump float;

vec2 uv = openfl_TextureCoordv.xy;
vec2 fragCoord = openfl_TextureCoordv * openfl_TextureSize;
vec2 iResolution = openfl_TextureSize;
uniform float iTime;
#define iChannel0 bitmap
#define texture flixel_texture2D

const float pi = 3.14159265358979323846;
const float epsilon = 1e-6;

const float fringeExp = 2.3;
const float fringeScale = 0.005;
const float distortionExp = 2.0;
const float distortionScale = 0.2;

const float startAngle = 1.23456 + pi;
const float angleStep = pi * 2.0 / 3.0;

void main() {
    vec2 baseUV = fragCoord.xy / iResolution.xy;
    vec2 fromCentre = baseUV - vec2(0.5, 0.5);
    fromCentre.y *= iResolution.y / iResolution.x;
    float radius = length(fromCentre);
    fromCentre = radius > epsilon ? (fromCentre * (1.0 / radius)) : vec2(0);

    float strength = 1.2;
    float rotation = 2.0 * pi;

    float fringing = fringeScale * pow(radius, fringeExp) * strength;
    float distortion = distortionScale * pow(radius, distortionExp) * strength;

    vec2 distortUV = baseUV - fromCentre * distortion;

    float angle;
    vec2 dir;

    angle = startAngle + rotation;
    dir = vec2(sin(angle), cos(angle));
    vec4 redPlane = texture2D(iChannel0, distortUV + fringing * dir);
    angle += angleStep;
    dir = vec2(sin(angle), cos(angle));
    vec4 greenPlane = texture2D(iChannel0, distortUV + fringing * dir);
    angle += angleStep;
    dir = vec2(sin(angle), cos(angle));
    vec4 bluePlane = texture2D(iChannel0, distortUV + fringing * dir);

    gl_FragColor = vec4(redPlane.r, greenPlane.g, bluePlane.b, 1.0);
}
