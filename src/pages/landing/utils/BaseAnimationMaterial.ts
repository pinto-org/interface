import * as THREE from "three";

class BaseAnimationMaterial extends THREE.ShaderMaterial {
  [key: string]: any;
  constructor(parameters: any, uniforms: any) {
    super();

    Object.keys(parameters).forEach((key: string) => {
      (this as any)[key] = parameters[key];
    });

    this.setValues(parameters);
    this.uniforms = THREE.UniformsUtils.merge([uniforms, parameters.uniforms || {}]);
    this.setUniformValues(parameters);
  }

  setUniformValues(values: any) {
    if (!values) return;

    Object.keys(values).forEach((key) => {
      if (key in this.uniforms) {
        this.uniforms[key].value = values[key];
      }
    });
  }

  stringifyChunk(name: string) {
    if (!this[name]) {
      return "";
    } else if (typeof this[name] === "string") {
      return this[name];
    } else {
      return this[name].join("\n");
    }
  }
}

export default BaseAnimationMaterial;
