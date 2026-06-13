import React, { useRef, useState, useEffect } from 'react';
import * as faceapi from 'face-api.js';
import api from '../api';
import './ReconhecimentoFacial.css';

const ReconhecimentoFacial = ({ funcionarioId, onClose, onSucesso }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('Inicializando câmera...');
  const [modelosCarregados, setModelosCarregados] = useState(false);

  useEffect(() => {
    const carregarModelos = async () => {
      setStatus('Carregando modelos de detecção facial...');
      const MODEL_URL = '/models';
      
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
        
        setModelosCarregados(true);
        setStatus('Modelos carregados. Iniciando câmera...');
        iniciarCamera();
      } catch (err) {
        console.error('Erro ao carregar modelos:', err);
        setStatus('Erro ao carregar modelos faciais. Verifique a pasta /models.');
      }
    };
    
    carregarModelos();
  }, []);

  const iniciarCamera = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      
      console.log('📷 Câmeras disponíveis:', videoDevices.map(d => d.label));
      
      let cameraId = null;
      const iriunCam = videoDevices.find(d => 
        d.label.toLowerCase().includes('iriun') || 
        d.label.toLowerCase().includes('mobile') ||
        d.label.toLowerCase().includes('phone')
      );
      
      if (iriunCam) {
        console.log('✅ Usando câmera Iriun:', iriunCam.label);
        cameraId = iriunCam.deviceId;
      } else {
        console.log('⚠️ Iriun não encontrado, usando câmera padrão');
        if (videoDevices.length > 0) {
          cameraId = videoDevices[videoDevices.length - 1].deviceId;
        }
      }
      
      const constraints = cameraId 
        ? { video: { deviceId: { exact: cameraId } } }
        : { video: true };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setStatus('Câmera ativa. Posicione o rosto na tela.');
      }
    } catch (err) {
      console.error('Erro ao acessar a câmera:', err);
      setStatus('Erro ao acessar a câmera. Verifique as permissões e se o Iriun está conectado.');
    }
  };

  const capturarFace = async () => {
    if (!videoRef.current || !modelosCarregados) return;
    
    setStatus('Detectando rosto...');
    try {
      const detections = await faceapi.detectSingleFace(
        videoRef.current, 
        new faceapi.TinyFaceDetectorOptions()
      ).withFaceLandmarks().withFaceDescriptor();
      
      if (detections) {
        setStatus('Rosto detectado! Enviando...');
        const descriptor = Array.from(detections.descriptor);
        
        if (funcionarioId) {
          try {
            await api.post(`/funcionarios/${funcionarioId}/face`, { descriptor });
            setStatus('✅ Face cadastrada com sucesso!');
            setTimeout(() => {
              if (onSucesso) onSucesso();
              if (onClose) onClose();
            }, 1500);
          } catch (err) {
            console.error(err);
            setStatus('Erro ao cadastrar face. Tente novamente.');
          }
        } else {
          try {
            // 🔥 ÚNICA LINHA CORRIGIDA 🔥
            const response = await api.post('/funcionarios/reconhecer', { descriptor });
            setStatus(`✅ Olá ${response.data.nome}! Ponto registrado com sucesso!`);
            setTimeout(() => {
              if (onSucesso) onSucesso(response.data);
              if (onClose) onClose();
            }, 2000);
          } catch (err) {
            console.error(err);
            setStatus('❌ Face não reconhecida. Tente novamente ou procure o RH.');
          }
        }
      } else {
        setStatus('Nenhum rosto detectado. Posicione-se melhor.');
      }
    } catch (err) {
      console.error('Erro na detecção facial:', err);
      setStatus('Erro na detecção. Tente novamente.');
    }
  };

  return (
    <div className="face-modal">
      <div className="face-content">
        <div className="face-header">
          <h3>😀 Reconhecimento Facial</h3>
          <button className="close-btn" onClick={onClose}>✖</button>
        </div>
        <div className="face-body">
          <div className="video-container">
            <video 
              ref={videoRef} 
              autoPlay 
              muted 
              playsInline 
              style={{ width: '100%', borderRadius: '8px' }}
            />
            <canvas ref={canvasRef} style={{ display: 'none' }} />
          </div>
          <div className="status-area">
            <p className="status">{status}</p>
            {modelosCarregados && (
              <button className="btn-capture" onClick={capturarFace}>
                {funcionarioId ? '📸 Cadastrar Face' : '👋 Bater Ponto'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReconhecimentoFacial;