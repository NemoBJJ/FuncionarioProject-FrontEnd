import React, { useRef, useState, useEffect } from 'react';
import * as faceapi from 'face-api.js';
import {
  ScanFace,
  X,
  Camera,
  Hand,
  Video
} from 'lucide-react';
import api from '../api';
import './ReconhecimentoFacial.css';

const ReconhecimentoFacial = ({ funcionarioId, onClose, onSucesso }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('Inicializando câmera...');
  const [modelosCarregados, setModelosCarregados] = useState(false);

  const [cameras, setCameras] = useState([]);
  const [cameraSelecionada, setCameraSelecionada] = useState('');

  useEffect(() => {
    carregarModelos();

    return () => {
      pararCamera();
    };
  }, []);

  const carregarModelos = async () => {
    setStatus('Carregando modelos de detecção facial...');

    const MODEL_URL = '/models';

    try {
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
      await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);

      setModelosCarregados(true);
      setStatus('Modelos carregados. Procurando câmeras...');

      await carregarCameras();
    } catch (err) {
      console.error('Erro ao carregar modelos:', err);

      setStatus(
        'Erro ao carregar modelos faciais. Verifique a pasta /models.'
      );

      setLoading(false);
    }
  };

  const carregarCameras = async () => {
    try {
      /*
       * Primeiro solicitamos permissão para acessar a câmera.
       * Isso faz o navegador liberar os nomes dos dispositivos.
       */
      const permissaoStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      });

      permissaoStream.getTracks().forEach((track) => track.stop());

      const devices = await navigator.mediaDevices.enumerateDevices();

      const videoDevices = devices.filter(
        (device) => device.kind === 'videoinput'
      );

      console.log(
        'Câmeras disponíveis:',
        videoDevices.map((camera) => ({
          label: camera.label,
          deviceId: camera.deviceId
        }))
      );

      setCameras(videoDevices);

      if (videoDevices.length > 0) {
        const primeiraCamera = videoDevices[0].deviceId;

        setCameraSelecionada(primeiraCamera);

        await iniciarCamera(primeiraCamera);
      } else {
        setStatus('Nenhuma câmera encontrada.');
        setLoading(false);
      }
    } catch (err) {
      console.error('Erro ao carregar câmeras:', err);

      setStatus(
        'Erro ao acessar as câmeras. Verifique as permissões do navegador.'
      );

      setLoading(false);
    }
  };

  const pararCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;

      stream.getTracks().forEach((track) => {
        track.stop();
      });

      videoRef.current.srcObject = null;
    }
  };

  const iniciarCamera = async (deviceId) => {
    if (!deviceId) {
      return;
    }

    try {
      setLoading(true);
      setStatus('Iniciando câmera...');

      pararCamera();

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: {
            exact: deviceId
          },
          width: {
            ideal: 1280
          },
          height: {
            ideal: 720
          }
        },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        try {
          await videoRef.current.play();
        } catch (playError) {
          console.warn(
            'O navegador ainda não iniciou o vídeo automaticamente:',
            playError
          );
        }

        setStatus(
          'Câmera ativa. Posicione o rosto na tela.'
        );
      }

      setLoading(false);
    } catch (err) {
      console.error('Erro ao acessar câmera:', err);

      setStatus(
        'Erro ao abrir a câmera selecionada. Escolha outra câmera.'
      );

      setLoading(false);
    }
  };

  const trocarCamera = async (event) => {
    const deviceId = event.target.value;

    setCameraSelecionada(deviceId);

    await iniciarCamera(deviceId);
  };

  const capturarFace = async () => {
    if (!videoRef.current || !modelosCarregados) {
      return;
    }

    if (videoRef.current.readyState < 2) {
      setStatus('A câmera ainda está carregando.');
      return;
    }

    setStatus('Detectando rosto...');

    try {
      const detections = await faceapi
        .detectSingleFace(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions()
        )
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detections) {
        setStatus(
          'Nenhum rosto detectado. Posicione-se melhor na câmera.'
        );

        return;
      }

      setStatus('Rosto detectado! Enviando...');

      const descriptor = Array.from(
        detections.descriptor
      );

      if (funcionarioId) {
        try {
          await api.post(
            `/funcionarios/${funcionarioId}/face`,
            {
              descriptor
            }
          );

          setStatus(
            'Face cadastrada com sucesso!'
          );

          setTimeout(() => {
            pararCamera();

            if (onSucesso) {
              onSucesso();
            }

            if (onClose) {
              onClose();
            }
          }, 1500);
        } catch (err) {
          console.error(
            'Erro ao cadastrar face:',
            err
          );

          setStatus(
            'Erro ao cadastrar face. Tente novamente.'
          );
        }

        return;
      }

      try {
        const response = await api.post(
          '/funcionarios/reconhecer',
          {
            descriptor
          }
        );

        setStatus(
          `Olá ${response.data.nome}! Ponto registrado com sucesso!`
        );

        setTimeout(() => {
          pararCamera();

          if (onSucesso) {
            onSucesso(response.data);
          }

          if (onClose) {
            onClose();
          }
        }, 2000);
      } catch (err) {
        console.error(
          'Erro ao reconhecer face:',
          err
        );

        setStatus(
          'Face não reconhecida. Tente novamente ou procure o RH.'
        );
      }
    } catch (err) {
      console.error(
        'Erro na detecção facial:',
        err
      );

      setStatus(
        'Erro na detecção. Tente novamente.'
      );
    }
  };

  const fecharModal = () => {
    pararCamera();

    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="face-modal">
      <div className="face-content">

        <div className="face-header">
          <h3
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <ScanFace size={28} />
            Reconhecimento Facial
          </h3>

          <button
            className="close-btn"
            onClick={fecharModal}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div className="face-body">

          {cameras.length > 0 && (
            <div
              style={{
                marginBottom: '15px'
              }}
            >
              <label
                htmlFor="camera-select"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '6px',
                  fontWeight: '600'
                }}
              >
                <Video size={18} />
                Escolha a câmera
              </label>

              <select
                id="camera-select"
                value={cameraSelecionada}
                onChange={trocarCamera}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                  fontSize: '14px'
                }}
              >
                {cameras.map(
                  (camera, index) => (
                    <option
                      key={
                        camera.deviceId ||
                        index
                      }
                      value={
                        camera.deviceId
                      }
                    >
                      {camera.label ||
                        `Câmera ${
                          index + 1
                        }`}
                    </option>
                  )
                )}
              </select>
            </div>
          )}

          <div className="video-container">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              style={{
                width: '100%',
                borderRadius: '8px',
                backgroundColor: '#000'
              }}
            />

            <canvas
              ref={canvasRef}
              style={{
                display: 'none'
              }}
            />
          </div>

          <div className="status-area">

            <p className="status">
              {status}
            </p>

            {modelosCarregados &&
              !loading && (
                <button
                  className="btn-capture"
                  onClick={capturarFace}
                  style={{
                    display:
                      'inline-flex',
                    alignItems:
                      'center',
                    justifyContent:
                      'center',
                    gap: '8px'
                  }}
                >
                  {funcionarioId ? (
                    <>
                      <Camera
                        size={20}
                      />
                      Cadastrar Face
                    </>
                  ) : (
                    <>
                      <Hand
                        size={20}
                      />
                      Bater Ponto
                    </>
                  )}
                </button>
              )}

          </div>

        </div>
      </div>
    </div>
  );
};

export default ReconhecimentoFacial;