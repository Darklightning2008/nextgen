import os
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024

origins = [origin.strip() for origin in os.getenv('CORS_ORIGINS', '*').split(',') if origin.strip()]
CORS(app, resources={r"/api/*": {"origins": origins}})

# Demo fixtures only. Replace this module with the real cryptographic and ML pipeline
# before presenting API responses as security decisions.
SAMPLES = {
    'CERT-2026-0417': {'verdict': 'Valid', 'forgery_probability': 0.04, 'quantum_exposure': 82, 'issuer': 'Univ-CA', 'key': 'RSA-2048'},
    'CERT-2026-0212': {'verdict': 'Suspicious', 'forgery_probability': 0.46, 'quantum_exposure': 80, 'issuer': 'Gov-CA', 'key': 'ECDSA P-256'},
    'CERT-2026-0733': {'verdict': 'Forged', 'forgery_probability': 0.93, 'quantum_exposure': 95, 'issuer': 'Self-signed', 'key': 'RSA-1024'},
    'CERT-2026-0590': {'verdict': 'Valid', 'forgery_probability': 0.02, 'quantum_exposure': 10, 'issuer': 'Corp-CA', 'key': 'ML-DSA'},
}

@app.get('/api/health')
def health():
    return jsonify({'status': 'ok', 'service': 'sigil-api', 'mode': 'demo'})

@app.get('/api/certificates')
def certificates():
    return jsonify({'mode': 'demo', 'count': len(SAMPLES), 'certificates': list(SAMPLES.keys())})

@app.post('/api/verify')
def verify_sample():
    payload = request.get_json(silent=True) or {}
    certificate_id = payload.get('certificate_id')
    if not isinstance(certificate_id, str) or certificate_id not in SAMPLES:
        return jsonify({'error': 'Unknown sample certificate ID'}), 400
    return jsonify({
        'mode': 'simulated',
        'certificate_id': certificate_id,
        **SAMPLES[certificate_id],
        'message': 'Illustrative sample response. No real certificate was cryptographically verified.'
    })

@app.errorhandler(413)
def too_large(_error):
    return jsonify({'error': 'Request exceeds the 10 MB limit'}), 413

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.getenv('PORT', '5000')))
