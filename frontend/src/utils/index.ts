import { validAnimations, validFacials } from "./constants";

  //populates animation field 
  export const setValidAnimation = (animation, setAnimation) => {
    if (!validAnimations.includes(animation)) {
      setAnimation("Idle");
      return
    }
    setAnimation(animation);

  }

  // populates fcial expression field
  export const setValidFacialAnimation = (facialAnimation, setFacialExpression) => {
    if (!validFacials.includes(facialAnimation)) {
      setFacialExpression("default");
      return
    }
    setFacialExpression(facialAnimation);

  }