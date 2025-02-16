/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React, { useEffect, useRef, useState } from 'react'
import { useAnimations, useGLTF } from '@react-three/drei'
import { button, useControls } from 'leva'
import * as THREE from "three";
import { facialBones, facialExpressions, gestures, validAnimations, validFacials, } from '../utils/constants';
import { useFrame } from '@react-three/fiber';
import { useMessagingAPI } from '../hooks/useMessage';


// face configs


export function Avatar(props) {
    const { nodes, materials, scene } = useGLTF(
        "/models/67a20f32a5a70477a3c9923e.glb"
    );
    const { animations } = useGLTF("/models/animations.glb");
    const group = useRef();
    const { actions, mixer } = useAnimations(animations, group);
    const [animation, setAnimation] = useState(
        animations.find((a) => a.name === "Idle") ? "Idle" : animations[0].name // Check if Idle animation exists otherwise use first animation
    );
    const [blink, setBlink] = useState(false);
    const [winkLeft, setWinkLeft] = useState(false);
    const [winkRight, setWinkRight] = useState(false);
    const [facialExpression, setFacialExpression] = useState("");
    const [audio, setAudio] = useState();
    const { messageChat, onMessagePlayed, sendMessage } = useMessagingAPI();
    const [configMode, setConfigMode] = useState(false)

    const [lipsync, setLipsync] = useState();

    //populates animation field 
    const setValidAnimation = (animation) => {
        if (!validAnimations.includes(animation)) {
            setAnimation("Idle");
            return
        }
        setAnimation(animation);

    }

    // populates fcial expression field
    const setValidFacialAnimation = (facialAnimation) => {
        if (!validFacials.includes(facialAnimation)) {
            setFacialExpression("default");
            return
        }
        setFacialExpression(facialAnimation);

    }

    // plays Animation clip if not null
    useEffect(() => {
        // nodes.Wolf3D_Head.morphTargetDictionary
        console.log(animation, "ANIMATION")
        actions[animation]
            .reset()
            .fadeIn(mixer.stats.actions.inUse === 0 ? 0 : 0.5)
            .play();

        return () => actions[animation].fadeOut(0.5);
    }, [animation]);

    // handles message input and plays sound
    useEffect(() => {
        console.log(messageChat, "message")
        if (!messageChat) {
            setAnimation("Idle");
            return;
        }
        setValidAnimation(messageChat.animation);
        setValidFacialAnimation(messageChat.facialExpression);
        setLipsync(messageChat.lipsync);
        const audio = new Audio("data:audio/mp3;base64," + messageChat.audio);
        audio.play();
        setAudio(audio);
        audio.onended = onMessagePlayed;
    }, [messageChat]);

    // Function to execute animation depending on the bone or node
    const lerpMorphTarget = (target, value, speed = 0.1) => {
        scene.traverse((child) => {
            if (child.isSkinnedMesh && child.morphTargetDictionary) {
                const index = child.morphTargetDictionary[target];
                if (
                    index === undefined ||
                    child.morphTargetInfluences[index] === undefined
                ) {
                    return;
                }
                child.morphTargetInfluences[index] = THREE.MathUtils.lerp(
                    child.morphTargetInfluences[index],
                    value,
                    speed
                );

                if (!configMode) {
                    try {
                        set({
                            [target]: value,
                        });
                    } catch (e) { }
                }
            }
        });
    };

    //Handle all animation play
    useFrame(() => {
        !configMode &&
            Object.keys(nodes.EyeLeft.morphTargetDictionary).forEach((key) => {
                const mapping = facialExpressions[facialExpression];
                if (key === "eyeBlinkLeft" || key === "eyeBlinkRight") {
                    return; // eyes wink/blink are handled separately
                }
                if (mapping && mapping[key]) {
                    lerpMorphTarget(key, mapping[key], 0.1);
                } else {
                    lerpMorphTarget(key, 0, 0.1);
                }
            });

        lerpMorphTarget("eyeBlinkLeft", blink || winkLeft ? 1 : 0, 0.5);
        lerpMorphTarget("eyeBlinkRight", blink || winkRight ? 1 : 0, 0.5);

        // LIPSYNC
        if (configMode) {
            return;
        }

        const appliedMorphTargets = [];
        if (messageChat && lipsync) {
            const currentAudioTime = audio.currentTime;
            for (let i = 0; i < lipsync.mouthCues.length; i++) {
                const mouthCue = lipsync.mouthCues[i];
                if (
                    currentAudioTime >= mouthCue.start &&
                    currentAudioTime <= mouthCue.end
                ) {
                    appliedMorphTargets.push(facialBones[mouthCue.value]);
                    lerpMorphTarget(facialBones[mouthCue.value], 1, 0.2);
                    break;
                }
            }
        }

        Object.values(facialBones).forEach((value) => {
            if (appliedMorphTargets.includes(value)) {
                return;
            }
            lerpMorphTarget(value, 0, 0.1);
        });

    });

    //handles all facial actions
    useControls("FacialExpressions", {
        sendMessage: button(() => sendMessage()),
        winkLeft: button(() => {
            setWinkLeft(true);
            setTimeout(() => setWinkLeft(false), 300);
        }),
        winkRight: button(() => {
            setWinkRight(true);
            setTimeout(() => setWinkRight(false), 300);
        }),
        animation: {
            value: animation,
            options: animations.map((a) => a.name),
            onChange: (value) => setAnimation(value),
        },
        facialExpression: {
            options: Object.keys(facialExpressions),
            onChange: (value) => setFacialExpression(value),
        },
        enableConfigMode: button(() => {
            setConfigMode(old => true);
            // window.alert("configMode set: "+configMode);
        }),
        disableConfigMode: button(() => {
            setConfigMode(false);
        }),
        logMorphTargetValues: button(() => {
            const emotionValues = {};
            Object.keys(nodes.EyeLeft.morphTargetDictionary).forEach((key) => {
                if (key === "eyeBlinkLeft" || key === "eyeBlinkRight") {
                    return; // eyes wink/blink are handled separately
                }
                const value =
                    nodes.EyeLeft.morphTargetInfluences[
                    nodes.EyeLeft.morphTargetDictionary[key]
                    ];
                if (value > 0.01) {
                    emotionValues[key] = value;
                }
            });
            console.log(JSON.stringify(emotionValues, null, 2));
        }),
    });

    const [, set] = useControls("MorphTarget", () =>
        Object.assign(
            {},
            ...Object.keys(nodes.EyeLeft.morphTargetDictionary).map((key) => {
                return {
                    [key]: {
                        label: key,
                        value: 0,
                        min: nodes.EyeLeft.morphTargetInfluences[
                            nodes.EyeLeft.morphTargetDictionary[key]
                        ],
                        max: 1,
                        onChange: (val) => {
                            console.log(configMode)
                            if (configMode) {
                                console.log("CALLED")
                                lerpMorphTarget(key, val, 1);
                            }
                        },
                    },
                };
            })
        )
    );

    //control Blink
    useEffect(() => {
        let blinkTimeout;
        const nextBlink = () => {
            blinkTimeout = setTimeout(() => {
                setBlink(true);
                setTimeout(() => {
                    setBlink(false);
                    nextBlink();
                }, 200);
            }, THREE.MathUtils.randInt(1000, 5000));
        };
        nextBlink();
        return () => clearTimeout(blinkTimeout);
    }, []);

    return (
        <group {...props} dispose={null} ref={group}>
            <primitive object={nodes.Hips} />
            <skinnedMesh
                name="EyeLeft"
                geometry={nodes.EyeLeft.geometry}
                material={materials.Wolf3D_Eye}
                skeleton={nodes.EyeLeft.skeleton}
                morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary}
                morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences}
            />
            <skinnedMesh
                name="EyeRight"
                geometry={nodes.EyeRight.geometry}
                material={materials.Wolf3D_Eye}
                skeleton={nodes.EyeRight.skeleton}
                morphTargetDictionary={nodes.EyeRight.morphTargetDictionary}
                morphTargetInfluences={nodes.EyeRight.morphTargetInfluences}
            />
            <skinnedMesh
                name="Wolf3D_Head"
                geometry={nodes.Wolf3D_Head.geometry}
                material={materials.Wolf3D_Skin}
                skeleton={nodes.Wolf3D_Head.skeleton}
                morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary}
                morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences}
            />
            <skinnedMesh
                name="Wolf3D_Teeth"
                geometry={nodes.Wolf3D_Teeth.geometry}
                material={materials.Wolf3D_Teeth}
                skeleton={nodes.Wolf3D_Teeth.skeleton}
                morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary}
                morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences}
            />
            <skinnedMesh
                geometry={nodes.Wolf3D_Hair.geometry}
                material={materials.Wolf3D_Hair}
                skeleton={nodes.Wolf3D_Hair.skeleton}
            />
            <skinnedMesh
                geometry={nodes.Wolf3D_Glasses.geometry}
                material={materials.Wolf3D_Glasses}
                skeleton={nodes.Wolf3D_Glasses.skeleton}
            />
            <skinnedMesh
                geometry={nodes.Wolf3D_Outfit_Top.geometry}
                material={materials.Wolf3D_Outfit_Top}
                skeleton={nodes.Wolf3D_Outfit_Top.skeleton}
            />
            <skinnedMesh
                geometry={nodes.Wolf3D_Outfit_Bottom.geometry}
                material={materials.Wolf3D_Outfit_Bottom}
                skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton}
            />
            <skinnedMesh
                geometry={nodes.Wolf3D_Outfit_Footwear.geometry}
                material={materials.Wolf3D_Outfit_Footwear}
                skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton}
            />
            <skinnedMesh
                geometry={nodes.Wolf3D_Body.geometry}
                material={materials.Wolf3D_Body}
                skeleton={nodes.Wolf3D_Body.skeleton}
            />
        </group>
    )
}

useGLTF.preload('/models/67a20f32a5a70477a3c9923e.glb')
useGLTF.preload('/models/animations.glb')

