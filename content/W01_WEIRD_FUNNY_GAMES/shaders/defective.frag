precision mediump float;

uniform sampler2D iChannel0;  // Texture input
uniform vec2 iResolution;     // Screen resolution
uniform float iTime;          // Time uniform (if you need animation)

// Constants
const float pi = 3.14159265358979323846;
const float epsilon = 1e-6;
const float fringeExp = 2.3;
const float fringeScale = 0.005;
const float distortionExp = 2.0;
const float distortionScale = 0.2;

const float startAngle = 1.23456 + pi; // tweak to get different fringe coloration
const float angleStep = pi * 2.0 / 3.0; // space samples every 120 degrees

void main() {
    vec2 fragCoord = gl_FragCoord.xy;
    vec2 baseUV = fragCoord / iResolution;
    vec2 fromCentre = baseUV - vec2(0.5, 0.5);

    // Correct for aspect ratio
    fromCentre.y *= iResolution.y / iResolution.x;

    float radius = length(fromCentre);
    fromCentre = radius > epsilon ? (fromCentre * (1.0 / radius)) : vec2(0.0);

    float strength = 1.2;
    float rotation = 2.0 * pi;

    float fringing = fringeScale * pow(radius, fringeExp) * strength;
    float distortion = distortionScale * pow(radius, distortionExp) * strength;

    vec2 distortUV = baseUV - fromCentre * distortion;

    float angle;
    vec2 dir;

    // Red Plane
    angle = startAngle + rotation;
    dir = vec2(sin(angle), cos(angle));
    vec4 redPlane = texture2D(iChannel0, distortUV + fringing * dir);

    // Green Plane
    angle += angleStep;
    dir = vec2(sin(angle), cos(angle));
    vec4 greenPlane = texture2D(iChannel0, distortUV + fringing * dir);

    // Blue Plane
    angle += angleStep;
    dir = vec2(sin(angle), cos(angle));
    vec4 bluePlane = texture2D(iChannel0, distortUV + fringing * dir);

    // Final output color
    gl_FragColor = vec4(redPlane.r, greenPlane.g, bluePlane.b, 1.0);
}
