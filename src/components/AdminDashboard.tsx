import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';

interface Submission {
  id: string;
  created_at: string;
  status: string;
  company_name?: string;
  contact_name?: string;
  contact_email?: string;
  dims_w_mm?: number;
  dims_d_mm?: number;
  dims_h_mm?: number;
  quantity?: number;
  deadline?: string;
  notes?: string;
  recommendation?: string;
  stl_url?: string;
  sent_to_client?: string;
  sent_message?: string;
  sent_date?: string;
}

export default function AdminDashboard() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [currentTab, setCurrentTab] = useState<'pending' | 'sent' | 'all'>('pending');
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'send'>('view');
  const [selectedClient, setSelectedClient] = useState('');
  const [message, setMessage] = useState('');
  const [recommendation, setRecommendation] = useState('');
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);

  useEffect(() => {
    loadSubmissions();
    const interval = setInterval(loadSubmissions, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isModalOpen && canvasRef.current) {
      initViewer();
    }
    return () => {
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, [isModalOpen]);

  useEffect(() => {
    if (selectedSubmission?.stl_url && sceneRef.current) {
      loadSTL(selectedSubmission.stl_url);
    }
  }, [selectedSubmission?.stl_url]);

  const loadSubmissions = async () => {
    try {
      const res = await fetch('/api/submissions');
      const data = await res.json();
      setSubmissions(data);
    } catch (err) {
      console.error('Error loading submissions:', err);
    }
  };

  const initViewer = () => {
    if (!canvasRef.current) return;

    const container = canvasRef.current;
    container.innerHTML = '';

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      5000
    );
    camera.position.set(200, 140, 200);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controlsRef.current = controls;

    const ambLight = new THREE.AmbientLight(0xffffff, 0.8);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
    dirLight.position.set(200, 200, 200);
    scene.add(ambLight, dirLight);

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();
  };

  const loadSTL = (url: string) => {
    const loader = new STLLoader();
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const controls = controlsRef.current;

    if (!scene || !camera || !controls) return;

    loader.load(url, (geometry) => {
      geometry.computeBoundingBox();
      
      const material = new THREE.MeshPhongMaterial({
        color: 0x8fb3ff,
        specular: 0x222222,
        shininess: 30,
      });

      if (meshRef.current) {
        scene.remove(meshRef.current);
        meshRef.current.geometry.dispose();
        (meshRef.current.material as THREE.Material).dispose();
      }

      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
      meshRef.current = mesh;

      const bb = geometry.boundingBox!;
      const size = new THREE.Vector3().subVectors(bb.max, bb.min);
      const center = new THREE.Vector3().addVectors(bb.min, bb.max).multiplyScalar(0.5);
      mesh.position.sub(center);

      const maxDim = Math.max(size.x, size.y, size.z) || 100;
      camera.position.set(maxDim * 1.8, maxDim * 1.2, maxDim * 1.8);
      controls.target.set(0, 0, 0);
      controls.update();
    });
  };

  const openModal = (submission: Submission, mode: 'view' | 'send') => {
    setSelectedSubmission(submission);
    setModalMode(mode);
    setIsModalOpen(true);
    setSelectedClient('');
    setMessage('');
    setRecommendation(submission.recommendation || '');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSubmission(null);
  };

  const handleSend = async () => {
    if (!selectedClient || !message || !selectedSubmission) {
      alert('Please select a client and enter a message');
      return;
    }

    try {
      const res = await fetch(`/api/submissions/${selectedSubmission.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'sent',
          sent_to_client: selectedClient,
          sent_message: message,
          sent_date: new Date().toISOString(),
          recommendation: recommendation || selectedSubmission.recommendation,
        }),
      });

      if (res.ok) {
        alert('Successfully sent to client!');
        closeModal();
        loadSubmissions();
      } else {
        alert('Error sending to client');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Error sending to client');
    }
  };

  const pendingSubmissions = submissions.filter((s) => s.status === 'pending');
  const sentSubmissions = submissions.filter((s) => s.status === 'sent');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl p-8 mb-8 shadow-lg">
          <h1 className="text-3xl font-bold mb-2">📊 Tangram Admin Dashboard</h1>
          <p className="text-purple-100">Manage manufacturing submissions and recommendations</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm p-2 mb-6 flex gap-2">
          <button
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              currentTab === 'pending'
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => setCurrentTab('pending')}
          >
            Pending
          </button>
          <button
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              currentTab === 'sent'
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => setCurrentTab('sent')}
          >
            Sent
          </button>
          <button
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              currentTab === 'all'
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => setCurrentTab('all')}
          >
            All Submissions
          </button>
        </div>

        {/* Tables */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {currentTab === 'pending' && (
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Company</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Contact</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Dimensions</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Quantity</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingSubmissions.map((s) => (
                  <tr key={s.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">{new Date(s.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4">{s.company_name || '-'}</td>
                    <td className="px-6 py-4">
                      {s.contact_name || '-'}
                      <br />
                      <small className="text-gray-500">{s.contact_email || '-'}</small>
                    </td>
                    <td className="px-6 py-4">
                      {s.dims_w_mm || '-'} × {s.dims_d_mm || '-'} × {s.dims_h_mm || '-'} mm
                    </td>
                    <td className="px-6 py-4">{s.quantity || '-'}</td>
                    <td className="px-6 py-4">
                      <button
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 mr-2"
                        onClick={() => openModal(s, 'view')}
                      >
                        View
                      </button>
                      <button
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                        onClick={() => openModal(s, 'send')}
                      >
                        Send
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {currentTab === 'sent' && (
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Date Sent</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Company</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Sent To</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Message</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sentSubmissions.map((s) => (
                  <tr key={s.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">
                      {s.sent_date ? new Date(s.sent_date).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4">{s.company_name || '-'}</td>
                    <td className="px-6 py-4">
                      <strong>{s.sent_to_client || '-'}</strong>
                    </td>
                    <td className="px-6 py-4">{s.sent_message || '-'}</td>
                    <td className="px-6 py-4">
                      <button
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                        onClick={() => openModal(s, 'view')}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {currentTab === 'all' && (
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Company</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Contact</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((s) => (
                  <tr key={s.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">{new Date(s.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4">{s.company_name || '-'}</td>
                    <td className="px-6 py-4">{s.contact_name || '-'}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          s.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : s.status === 'sent'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                        onClick={() => openModal(s, 'view')}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Submission Details</h2>
              <button
                className="text-3xl text-gray-400 hover:text-gray-600"
                onClick={closeModal}
              >
                ×
              </button>
            </div>

            {/* Dimensions Display */}
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h4 className="font-semibold text-gray-700 mb-4">Dimensions</h4>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-sm text-gray-500 mb-1">Width</div>
                  <div className="text-3xl font-bold text-purple-600">
                    {selectedSubmission.dims_w_mm || '-'}
                  </div>
                  <div className="text-sm text-gray-500">mm</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500 mb-1">Depth</div>
                  <div className="text-3xl font-bold text-purple-600">
                    {selectedSubmission.dims_d_mm || '-'}
                  </div>
                  <div className="text-sm text-gray-500">mm</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500 mb-1">Height</div>
                  <div className="text-3xl font-bold text-purple-600">
                    {selectedSubmission.dims_h_mm || '-'}
                  </div>
                  <div className="text-sm text-gray-500">mm</div>
                </div>
              </div>
            </div>

            {/* 3D Preview */}
            <div
              ref={canvasRef}
              className="w-full h-80 bg-black rounded-xl mb-6"
            ></div>

            {modalMode === 'view' ? (
              <>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      value={selectedSubmission.company_name || ''}
                      readOnly
                      className="w-full px-4 py-2 border rounded-lg bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Contact
                    </label>
                    <input
                      type="text"
                      value={selectedSubmission.contact_name || ''}
                      readOnly
                      className="w-full px-4 py-2 border rounded-lg bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="text"
                      value={selectedSubmission.contact_email || ''}
                      readOnly
                      className="w-full px-4 py-2 border rounded-lg bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Quantity
                    </label>
                    <input
                      type="text"
                      value={selectedSubmission.quantity || ''}
                      readOnly
                      className="w-full px-4 py-2 border rounded-lg bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Deadline
                    </label>
                    <input
                      type="text"
                      value={selectedSubmission.deadline || ''}
                      readOnly
                      className="w-full px-4 py-2 border rounded-lg bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      value={selectedSubmission.notes || ''}
                      readOnly
                      rows={3}
                      className="w-full px-4 py-2 border rounded-lg bg-gray-50"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Send to Client *
                    </label>
                    <select
                      value={selectedClient}
                      onChange={(e) => setSelectedClient(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    >
                      <option value="">Select a client...</option>
                      <option value="Client A">Client A</option>
                      <option value="Client B">Client B</option>
                      <option value="Client C">Client C</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={4}
                      placeholder="Enter your message to the client..."
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Recommendation (optional)
                    </label>
                    <textarea
                      value={recommendation}
                      onChange={(e) => setRecommendation(e.target.value)}
                      rows={3}
                      placeholder="Add manufacturing recommendation..."
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <button
                    onClick={handleSend}
                    className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                  >
                    Send to Client
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
