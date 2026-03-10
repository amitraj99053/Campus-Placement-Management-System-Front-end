import React, { useState, useEffect, useRef } from 'react';
import { ScanFace, Loader2, Camera } from 'lucide-react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';
import api from '../services/api';
import { toast } from 'react-toastify';

const FaceIdSetup = () => {
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [registeringFace, setRegisteringFace] = useState(false);
    const [faceProcessing, setFaceProcessing] = useState(false);
    const webcamRef = useRef(null);

    useEffect(() => {
        const loadModels = async () => {
            try {
                const MODEL_URL = 'https://justadudewhohacks.github.io/face-api.js/models';
                await Promise.all([
                    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
                ]);
                setModelsLoaded(true);
            } catch (err) {
                console.error("Failed to load face-api models", err);
            }
        };

        if (registeringFace && !modelsLoaded) {
            loadModels();
        }
    }, [registeringFace, modelsLoaded]);

    const handleRegisterFace = async () => {
        if (!webcamRef.current) return;
        setFaceProcessing(true);
        try {
            const imageSrc = webcamRef.current.getScreenshot();
            if (!imageSrc) throw new Error("Webcam not ready");

            console.log("Capturing face for registration...");
            const img = await faceapi.fetchImage(imageSrc);
            const detection = await faceapi.detectSingleFace(img, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();

            if (!detection) {
                console.warn("No face detected during registration");
                toast.error("No face detected. Please position yourself clearly.");
                setFaceProcessing(false);
                return;
            }

            console.log("Face detected. Descriptor length:", detection.descriptor.length);
            const descriptor = Array.from(detection.descriptor);

            await api.post('/users/face-register', { descriptor });
            toast.success("Face registered successfully! You can now use Face Login.");
            setRegisteringFace(false);
        } catch (error) {
            console.error("Face registration error:", error);
            if (error.response) {
                console.error("Server Response:", error.response.data);
                toast.error(`Server Error: ${error.response.data.message || 'Unknown error'}`);
            } else if (error.request) {
                console.error("No response received:", error.request);
                toast.error("Network Error: Unable to reach the server. Please check your connection.");
            } else {
                console.error("Error setting up request:", error.message);
                toast.error(`Error: ${error.message}`);
            }
        } finally {
            setFaceProcessing(false);
        }
    };

    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <ScanFace className="text-indigo-600" size={24} /> Security Settings (Face ID)
                </h2>
            </div>

            <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
                {!registeringFace ? (
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-semibold text-slate-800">Biometric Login</h3>
                            <p className="text-xs text-slate-500">Enable face login for faster access.</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setRegisteringFace(true)}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition flex items-center gap-2"
                        >
                            <Camera size={16} /> Register Face
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="bg-black rounded-lg overflow-hidden h-64 relative max-w-md mx-auto">
                            {modelsLoaded ? (
                                <Webcam
                                    audio={false}
                                    ref={webcamRef}
                                    screenshotFormat="image/jpeg"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-white">Loading Face Models...</div>
                            )}
                        </div>
                        <div className="flex justify-center gap-4">
                            <button
                                type="button"
                                onClick={handleRegisterFace}
                                disabled={faceProcessing || !modelsLoaded}
                                className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition flex items-center gap-2"
                            >
                                {faceProcessing ? <Loader2 className="animate-spin" /> : <ScanFace size={16} />}
                                {faceProcessing ? 'Processing...' : 'Capture & Register'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setRegisteringFace(false)}
                                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FaceIdSetup;
