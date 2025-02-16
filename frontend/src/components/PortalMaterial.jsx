import { shaderMaterial } from "@react-three/drei"
import { Color } from "three"

const PortalMaterial = shaderMaterial(
    { 
        uTime: 0, 
        uColorStart: new Color('hotpink'), 
        uColorEnd: new Color('white') 
    },
    // Vertex shader (unchanged)
    /* glsl */`
    varying vec2 vUv;
    void main() {
      vec4 modelPosition = modelMatrix * vec4(position, 1.0);
      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectionPosition = projectionMatrix * viewPosition;
      gl_Position = projectionPosition;
      vUv = uv;
    }`,
    // Fragment shader (simplified)
    /* glsl */`
    uniform float uTime;
    uniform vec3 uColorStart;
    uniform vec3 uColorEnd;
    varying vec2 vUv;

    float noise(vec3 p) {
        return fract(sin(dot(p, vec3(12.9898, 78.233, 45.5432))) * 43758.5453);
    }

    void main() {
      // Simplified noise calculation
      vec2 displacedUv = vUv + noise(vec3(vUv * 7.0, uTime * 0.1));
      float strength = noise(vec3(displacedUv * 5.0, uTime * 0.2));
      
      float outerGlow = distance(vUv, vec2(0.5)) * 4.0 - 1.4;
      strength += outerGlow;
      strength += step(-0.2, strength) * 0.8;
      strength = clamp(strength, 0.0, 1.0);
      
      vec3 color = mix(uColorStart, uColorEnd, strength);
      gl_FragColor = vec4(color, 1.0);
    }`
)

export default PortalMaterial